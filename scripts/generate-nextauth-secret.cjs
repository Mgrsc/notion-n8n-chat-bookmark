#!/usr/bin/env node

/**
 * NextAuth Secret 生成脚本
 * 用于生成 NEXTAUTH_SECRET 环境变量
 *
 * 使用方法:
 *   node scripts/generate-nextauth-secret.js
 */

const crypto = require('crypto')

console.log('🔑 正在生成 NextAuth Secret...\n')

const secret = crypto.randomBytes(32).toString('base64')

console.log('✅ NextAuth Secret 生成成功！\n')
console.log('请将以下内容添加到 .env.local 文件中:')
console.log('─────────────────────────────────────')
console.log(`NEXTAUTH_SECRET="${secret}"`)
console.log('─────────────────────────────────────\n')
console.log('💡 提示: 或者使用命令: openssl rand -base64 32')
