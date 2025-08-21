#!/usr/bin/env node

/**
 * 移除本地调试链接，恢复原来的 navpress 包
 * 用法: node scripts/unlink-local.js [目标项目路径]
 */

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// 目标项目路径
const targetProject =
  process.argv[2] || '/Users/jiajunlin/usmart-code/pintree-nav'

async function removeLocalLink() {
  console.log('🔗 移除 NavPress 本地调试链接')
  console.log(`🎯 目标项目: ${targetProject}`)

  // 检查目标项目是否存在
  if (!fs.existsSync(targetProject)) {
    console.error(`❌ 目标项目不存在: ${targetProject}`)
    process.exit(1)
  }

  const targetNodeModules = path.join(targetProject, 'node_modules')
  const targetNavpress = path.join(targetNodeModules, 'navpress')

  try {
    // 检查是否存在 navpress 链接
    if (fs.existsSync(targetNavpress)) {
      const stats = fs.lstatSync(targetNavpress)
      if (stats.isSymbolicLink()) {
        console.log('🗑️ 删除符号链接...')
        fs.unlinkSync(targetNavpress)

        // 重新安装原来的 navpress 包
        console.log('📦 重新安装 navpress 包...')
        const { stdout, stderr } = await execAsync('yarn install', {
          cwd: targetProject,
        })

        if (stderr && !stderr.includes('warning')) {
          console.error('安装警告:', stderr)
        }

        console.log('✅ 恢复完成!')
        console.log('🔄 现在使用的是 npm 仓库中的 navpress 版本')
      } else {
        console.log('📁 navpress 不是符号链接，无需移除')
      }
    } else {
      console.log('❌ 未找到 navpress 链接')
    }
  } catch (error) {
    console.error('❌ 移除链接失败:', error.message)
    console.log('\n💡 手动操作:')
    console.log(`1. 删除: ${targetNavpress}`)
    console.log(`2. 在项目中运行: yarn install`)
    process.exit(1)
  }
}

removeLocalLink()
