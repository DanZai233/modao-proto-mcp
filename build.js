const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  // 确保 bin 目录存在
  if (!fs.existsSync('bin')) {
    fs.mkdirSync('bin', { recursive: true });
  }

  try {
    // 构建主程序
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'bin/cli.js',
      format: 'cjs',
      banner: {
        js: '#!/usr/bin/env node'
      },
      external: [
        // 保持一些包为外部依赖
      ],
      minify: false,
      sourcemap: false,
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });

    // 设置执行权限
    fs.chmodSync('bin/cli.js', 0o755);
    
    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build(); 