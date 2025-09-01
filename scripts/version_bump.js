#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 版本号升级脚本
 * 用法: node scripts/version_bump.js [major|minor|patch] [版本号]
 * 
 * 示例:
 * node scripts/version_bump.js patch        # 1.0.0 -> 1.0.1
 * node scripts/version_bump.js minor        # 1.0.0 -> 1.1.0
 * node scripts/version_bump.js major        # 1.0.0 -> 2.0.0
 * node scripts/version_bump.js 1.2.3        # 直接设置为 1.2.3
 */

// 获取命令行参数
const args = process.argv.slice(2);
const bumpType = args[0] || 'patch';

// 项目根目录
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const indexTsPath = path.join(rootDir, 'src/index.ts');

/**
 * 解析版本号
 */
function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    patch: parseInt(match[3])
  };
}

/**
 * 升级版本号
 */
function bumpVersion(currentVersion, bumpType) {
  // 如果bumpType是具体版本号，直接返回
  if (/^\d+\.\d+\.\d+$/.test(bumpType)) {
    return bumpType;
  }

  const version = parseVersion(currentVersion);
  
  switch (bumpType) {
    case 'major':
      version.major++;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor++;
      version.patch = 0;
      break;
    case 'patch':
      version.patch++;
      break;
    default:
      throw new Error(`Invalid bump type: ${bumpType}. Use major, minor, patch, or a specific version number.`);
  }
  
  return `${version.major}.${version.minor}.${version.patch}`;
}

/**
 * 更新package.json中的版本号
 */
function updatePackageJson(newVersion) {
  console.log('📦 更新 package.json...');
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const oldVersion = packageJson.version;
  
  packageJson.version = newVersion;
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  
  console.log(`   版本号: ${oldVersion} → ${newVersion}`);
  return oldVersion;
}

/**
 * 更新src/index.ts中的MCP服务器版本号
 */
function updateIndexTs(newVersion) {
  console.log('🔧 更新 src/index.ts...');
  
  let content = fs.readFileSync(indexTsPath, 'utf8');
  
  // 查找并替换MCP服务器版本号
  const serverVersionRegex = /name: 'modao-proto-mcp',\s*version: '[^']*'/;
  const newServerVersion = `name: 'modao-proto-mcp',\n        version: '${newVersion}'`;
  
  if (serverVersionRegex.test(content)) {
    content = content.replace(serverVersionRegex, newServerVersion);
    fs.writeFileSync(indexTsPath, content);
    console.log(`   MCP服务器版本号已更新为: ${newVersion}`);
  } else {
    console.warn('   ⚠️  未找到MCP服务器版本号配置');
  }
}

/**
 * 创建Git提交
 */
function createGitCommit(newVersion) {
  console.log('📝 创建Git提交...');
  
  try {
    // 检查是否有未提交的更改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    // 添加修改的文件
    execSync('git add package.json src/index.ts');
    
    // 创建提交
    const commitMessage = `VERSION: ${newVersion}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    console.log(`   提交信息: ${commitMessage}`);
  } catch (error) {
    console.error('❌ Git提交失败:', error.message);
    throw error;
  }
}

/**
 * 主函数
 */
function main() {
  try {
    console.log('🚀 开始版本号升级...\n');
    
    // 读取当前版本号
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    
    console.log(`📋 当前版本: ${currentVersion}`);
    console.log(`📋 升级类型: ${bumpType}\n`);
    
    // 计算新版本号
    const newVersion = bumpVersion(currentVersion, bumpType);
    
    if (newVersion === currentVersion) {
      console.log('ℹ️  版本号未变更，退出。');
      return;
    }
    
    console.log(`🎯 目标版本: ${newVersion}\n`);
    
    // 更新文件
    updatePackageJson(newVersion);
    updateIndexTs(newVersion);
    
    // 创建Git提交
    createGitCommit(newVersion);
    
    console.log(`\n✅ 版本升级完成！`);
    console.log(`📦 新版本: ${newVersion}`);
    console.log(`💡 接下来可以运行: npm run tag_push`);
    
  } catch (error) {
    console.error('\n❌ 版本升级失败:', error.message);
    process.exit(1);
  }
}

// 显示帮助信息
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
版本号升级脚本

用法:
  node scripts/version_bump.js [类型|版本号]

参数:
  patch     补丁版本升级 (默认) 1.0.0 -> 1.0.1
  minor     次版本升级         1.0.0 -> 1.1.0  
  major     主版本升级         1.0.0 -> 2.0.0
  x.x.x     直接设置版本号      1.0.0 -> x.x.x

示例:
  npm run version_bump patch
  npm run version_bump minor
  npm run version_bump major
  npm run version_bump 2.0.0

功能:
  - 更新 package.json 中的版本号
  - 更新 src/index.ts 中的MCP服务器版本号
  - 自动创建Git提交 (格式: VERSION: x.x.x)
`);
  process.exit(0);
}

// 执行主函数
main();
