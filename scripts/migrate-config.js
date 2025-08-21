#!/usr/bin/env node

/**
 * 配置文件迁移工具 - 将旧版本配置迁移到新版本
 * 用法: node scripts/migrate-config.js [源配置文件] [目标配置文件]
 */

import fs from 'fs'
import path from 'path'

const sourceConfig =
  process.argv[2] ||
  '/Users/jiajunlin/usmart-code/pintree-nav/navpress.config.js'
const targetConfig =
  process.argv[3] ||
  path.join(path.dirname(sourceConfig), 'navpress.config.new.js')

async function migrateConfig() {
  console.log('🔄 NavPress 配置文件迁移工具')
  console.log(`📁 源文件: ${sourceConfig}`)
  console.log(`📁 目标文件: ${targetConfig}`)

  try {
    // 动态导入配置文件
    const configModule = await import(sourceConfig)
    const oldConfig = configModule.default

    console.log('📋 分析配置结构...')

    // 迁移 sidebar 结构
    const newSidebar = migrateSidebar(oldConfig.sidebar || [])

    // 构建新配置
    const newConfig = {
      title: oldConfig.title,
      description: oldConfig.description,
      logo: oldConfig.logo,
      base: oldConfig.base,
      github: oldConfig.github,
      urlFormat: oldConfig.urlFormat || 'query',
      meta: oldConfig.meta,
      sidebar: newSidebar,
    }

    // 生成新配置文件内容
    const configContent = `// navpress.config.js - 迁移到新版本
export default ${JSON.stringify(newConfig, null, 2)}`

    // 写入文件
    fs.writeFileSync(targetConfig, configContent, 'utf8')

    console.log('✅ 配置迁移完成!')
    console.log(`📄 新配置文件: ${targetConfig}`)
    console.log(`\n🔧 主要变更:`)
    console.log(`- 将 'items[].groups[]' 结构改为 'items[].items[]'`)
    console.log(`- 移除 'expanded' 属性`)
    console.log(`- 保持所有链接和描述不变`)
    console.log(`\n📋 下一步:`)
    console.log(`1. 检查新配置文件`)
    console.log(`2. 备份原配置文件`)
    console.log(`3. 用新配置文件替换原文件`)
  } catch (error) {
    console.error('❌ 迁移失败:', error.message)
    console.log('\n💡 可能的原因:')
    console.log('1. 源配置文件路径不正确')
    console.log('2. 配置文件格式不兼容')
    console.log('3. 文件权限问题')
    process.exit(1)
  }
}

function migrateSidebar(oldSidebar) {
  return oldSidebar.map((item) => {
    const newItem = {
      text: item.text,
      link: item.link,
    }

    // 如果有 groups，转换为 items
    if (item.groups && Array.isArray(item.groups)) {
      newItem.items = item.groups.map((group) => ({
        text: group.text,
        link: group.link,
        items: group.items || [],
      }))
    }
    // 如果已经是 items 结构，直接使用
    else if (item.items && Array.isArray(item.items)) {
      newItem.items = item.items.map((subItem) => {
        if (subItem.groups) {
          // 递归处理嵌套的 groups
          return {
            text: subItem.text,
            link: subItem.link,
            items: subItem.groups.map((group) => ({
              text: group.text,
              link: group.link,
              items: group.items || [],
            })),
          }
        }
        return subItem
      })
    }

    return newItem
  })
}

migrateConfig()
