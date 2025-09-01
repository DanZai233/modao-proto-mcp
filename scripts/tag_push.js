#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 标签创建和推送脚本
 * 用法: node scripts/tag_push.js [版本号]
 * 
 * 功能:
 * - 读取package.json中的版本号
 * - 创建Git标签
 * - 推送标签到远程仓库
 * - 推送代码到远程仓库
 */

// 获取命令行参数
const args = process.argv.slice(2);
const specifiedVersion = args[0];

// 项目根目录
const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');

/**
 * 获取当前版本号
 */
function getCurrentVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    throw new Error(`无法读取package.json: ${error.message}`);
  }
}

/**
 * 检查Git状态
 */
function checkGitStatus() {
  try {
    // 检查是否在Git仓库中
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    // 检查是否有未提交的更改
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.warn('⚠️  检测到未提交的更改:');
      console.warn(status);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      return new Promise((resolve) => {
        rl.question('是否继续创建标签? (y/N): ', (answer) => {
          rl.close();
          if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
            console.log('❌ 操作已取消');
            process.exit(0);
          }
          resolve();
        });
      });
    }
  } catch (error) {
    throw new Error('当前目录不是Git仓库');
  }
}

/**
 * 检查标签是否已存在
 */
function checkTagExists(version) {
  try {
    const tags = execSync('git tag -l', { encoding: 'utf8' });
    const tagList = tags.split('\n').filter(tag => tag.trim());
    
    if (tagList.includes(`v${version}`)) {
      throw new Error(`标签 v${version} 已存在`);
    }
  } catch (error) {
    if (error.message.includes('已存在')) {
      throw error;
    }
    // 其他错误忽略，可能是没有标签
  }
}

/**
 * 获取远程仓库信息
 */
function getRemoteInfo() {
  try {
    const remotes = execSync('git remote -v', { encoding: 'utf8' });
    const originMatch = remotes.match(/origin\s+(.+?)\s+\(push\)/);
    
    if (originMatch) {
      return {
        name: 'origin',
        url: originMatch[1]
      };
    }
    
    // 如果没有origin，获取第一个远程仓库
    const firstRemoteMatch = remotes.match(/(\w+)\s+(.+?)\s+\(push\)/);
    if (firstRemoteMatch) {
      return {
        name: firstRemoteMatch[1],
        url: firstRemoteMatch[2]
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 创建Git标签
 */
function createTag(version) {
  console.log('🏷️  创建Git标签...');
  
  try {
    const tagName = `v${version}`;
    const tagMessage = `Release version ${version}`;
    
    // 创建带注释的标签
    execSync(`git tag -a "${tagName}" -m "${tagMessage}"`, { stdio: 'inherit' });
    
    console.log(`   标签名称: ${tagName}`);
    console.log(`   标签信息: ${tagMessage}`);
    
    return tagName;
  } catch (error) {
    throw new Error(`创建标签失败: ${error.message}`);
  }
}

/**
 * 推送到远程仓库
 */
function pushToRemote(tagName, remote) {
  console.log('🚀 推送到远程仓库...');
  
  try {
    // 推送代码
    console.log(`   推送代码到 ${remote.name}...`);
    execSync(`git push ${remote.name}`, { stdio: 'inherit' });
    
    // 推送标签
    console.log(`   推送标签 ${tagName} 到 ${remote.name}...`);
    execSync(`git push ${remote.name} ${tagName}`, { stdio: 'inherit' });
    
    console.log(`   远程仓库: ${remote.url}`);
  } catch (error) {
    throw new Error(`推送失败: ${error.message}`);
  }
}

/**
 * 显示发布信息
 */
function showReleaseInfo(version, tagName, remote) {
  console.log(`\n🎉 发布完成！`);
  console.log(`📦 版本: ${version}`);
  console.log(`🏷️  标签: ${tagName}`);
  
  if (remote) {
    console.log(`🌐 远程仓库: ${remote.url}`);
    
    // 如果是GitHub仓库，显示Release页面链接
    if (remote.url.includes('github.com')) {
      const repoMatch = remote.url.match(/github\.com[:/](.+?)(?:\.git)?$/);
      if (repoMatch) {
        const repoPath = repoMatch[1];
        console.log(`📋 创建Release: https://github.com/${repoPath}/releases/new?tag=${tagName}`);
      }
    }
  }
  
  console.log(`\n💡 后续步骤:`);
  console.log(`   - 检查远程仓库中的标签和代码`);
  console.log(`   - 如需发布到npm: npm publish`);
  console.log(`   - 创建GitHub Release (如适用)`);
}

/**
 * 主函数
 */
async function main() {
  try {
    console.log('🚀 开始标签创建和推送...\n');
    
    // 获取版本号
    const version = specifiedVersion || getCurrentVersion();
    console.log(`📋 目标版本: ${version}\n`);
    
    // 检查Git状态
    await checkGitStatus();
    
    // 检查标签是否已存在
    checkTagExists(version);
    
    // 获取远程仓库信息
    const remote = getRemoteInfo();
    if (!remote) {
      console.warn('⚠️  未检测到远程仓库，将只创建本地标签');
    } else {
      console.log(`📡 远程仓库: ${remote.name} (${remote.url})\n`);
    }
    
    // 创建标签
    const tagName = createTag(version);
    
    // 推送到远程仓库
    if (remote) {
      pushToRemote(tagName, remote);
    }
    
    // 显示发布信息
    showReleaseInfo(version, tagName, remote);
    
  } catch (error) {
    console.error('\n❌ 操作失败:', error.message);
    process.exit(1);
  }
}

// 显示帮助信息
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
标签创建和推送脚本

用法:
  node scripts/tag_push.js [版本号]

参数:
  版本号    可选，如不指定则使用package.json中的版本号

示例:
  npm run tag_push         # 使用package.json中的版本号
  npm run tag_push 1.2.3   # 使用指定版本号

功能:
  - 检查Git仓库状态
  - 创建带注释的Git标签 (格式: vx.x.x)
  - 推送代码到远程仓库
  - 推送标签到远程仓库
  - 显示发布信息和后续步骤

注意:
  - 确保所有更改已提交
  - 确保有推送权限到远程仓库
  - 标签名不能重复
`);
  process.exit(0);
}

// 执行主函数
main();
