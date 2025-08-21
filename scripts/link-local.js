#!/usr/bin/env node

/**
 * 本地调试工具 - 创建符号链接来测试本地 navpress 修改
 * 用法: node scripts/link-local.js [目标项目路径]
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// NavPress 项目根目录
const navpressRoot = path.resolve(__dirname, '..')
// 目标项目路径
const targetProject =
  process.argv[2] || '/Users/jiajunlin/usmart-code/pintree-nav'

async function createLocalLink() {
  console.log('🔗 NavPress 本地调试工具')
  console.log(`📁 NavPress 路径: ${navpressRoot}`)
  console.log(`🎯 目标项目: ${targetProject}`)

  // 检查目标项目是否存在
  if (!fs.existsSync(targetProject)) {
    console.error(`❌ 目标项目不存在: ${targetProject}`)
    process.exit(1)
  }

  const targetNodeModules = path.join(targetProject, 'node_modules')
  const targetNavpress = path.join(targetNodeModules, 'navpress')

  try {
    // 确保 node_modules 目录存在
    if (!fs.existsSync(targetNodeModules)) {
      console.log('📦 创建 node_modules 目录...')
      fs.mkdirSync(targetNodeModules, { recursive: true })
    }

    // 如果已经存在 navpress 链接或目录，先删除
    if (fs.existsSync(targetNavpress)) {
      console.log('🗑️ 删除现有的 navpress...')
      const stats = fs.lstatSync(targetNavpress)
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(targetNavpress)
      } else {
        fs.rmSync(targetNavpress, { recursive: true, force: true })
      }
    }

    // 创建符号链接
    console.log('🔗 创建符号链接...')
    fs.symlinkSync(navpressRoot, targetNavpress, 'dir')

    console.log('✅ 本地调试链接创建成功!')
    console.log(`\n📋 接下来的操作:`)
    console.log(`1. cd ${targetProject}`)
    console.log(`2. yarn dev 或 npm run dev`)
    console.log(`3. 在 NavPress 项目中修改代码会立即生效`)
    console.log(`\n🔧 调试完成后运行: node scripts/unlink-local.js 恢复`)
  } catch (error) {
    console.error('❌ 创建链接失败:', error.message)
    console.log('\n💡 可能的解决方案:')
    console.log('1. 确保有写入权限')
    console.log('2. 尝试用 sudo 运行 (macOS/Linux)')
    console.log('3. 或者使用管理员权限 (Windows)')
    process.exit(1)
  }
}

createLocalLink()
