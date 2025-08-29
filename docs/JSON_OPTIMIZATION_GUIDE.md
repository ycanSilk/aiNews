# JSON 数据结构优化指南

## 概述

本项目采用了混合存储策略的JSON优化方案，旨在解决多语言支持、数据冗余管理和数据结构标准化等问题。

## 架构设计

### 1. 核心文件结构

```
src/data/
├── newsMasterData.json          # 新闻主数据文件（核心）
├── config/
│   ├── semanticIdConfig.json     # 语义化ID配置
│   ├── localeConfig.json         # 多语言配置
│   ├── indexConfig.json          # 数据索引配置
│   ├── statsConfig.json          # 统计配置
│   └── apiConfig.json            # API配置
├── ch/
│   └── newsData.json            # 中文数据（自动生成）
└── en/
    └── newsData.json            # 英文数据（自动生成）
```

### 2. 数据模型

#### 新闻主数据格式 (newsMasterData.json)
```json
{
  "version": "1.0",
  "lastUpdated": "2024-01-15T10:00:00Z",
  "news": [
    {
      "id": 1,
      "semanticId": "openai-gpt5-20250827001",
      "category": "大语言模型",
      "source": "OpenAI",
      "author": "OpenAI Team",
      "publishTime": "2025-08-27T09:00:00Z",
      "isBreaking": true,
      "isImportant": true,
      "views": 15200,
      "comments": 324,
      "locales": {
        "en": {
          "title": "OpenAI Announces GPT-5 Launch Date",
          "summary": "OpenAI officially confirms GPT-5 release...",
          "tags": ["GPT-5", "OpenAI", "AI"]
        },
        "zh": {
          "title": "OpenAI宣布GPT-5发布日期",
          "summary": "OpenAI官方确认GPT-5将于...",
          "tags": ["GPT-5", "OpenAI", "人工智能"]
        }
      }
    }
  ]
}
```

## 功能特性

### 1. 语义化ID系统
- **格式**: `{company}-{product}-{date}-{sequence}`
- **示例**: `openai-gpt5-20250827-001`
- **优势**: 易于识别、排序和检索

### 2. 多语言支持
- 支持中英文双语
- 语言特定字段分离，便于独立优化
- 统一的本地化管理

### 3. 数据验证
- 语义化ID格式验证
- 必填字段检查
- 数据类型验证
- 多语言数据完整性检查

## 使用指南

### 安装依赖
```bash
npm install
```

### 数据迁移（首次使用）
```bash
npm run data:migrate
```

### 数据验证
```bash
npm run data:validate
```

### 同步语言数据
```bash
npm run data:sync
```

### 检查数据一致性
```bash
npm run data:check
```

### 创建备份
```bash
npm run data:backup
```

## 脚本说明

### migrateToMasterData.js
- 从旧格式迁移数据到新主数据格式
- 自动生成语义化ID
- 合并多语言数据

### validateData.js
- 验证数据完整性和正确性
- 输出详细的错误报告
- 支持批量验证

### syncLanguageData.js
- 从主数据生成语言特定文件
- 保持数据一致性
- 自动备份机制

## 最佳实践

### 1. 数据编辑流程
1. 编辑 `newsMasterData.json` 主文件
2. 运行 `npm run data:validate` 验证数据
3. 运行 `npm run data:sync` 同步到语言文件
4. 运行 `npm run data:check` 检查一致性

### 2. 语义化ID命名规范
- 使用小写字母和连字符
- 日期格式: YYYYMMDD
- 序列号: 3位数字
- 公司名称使用标准缩写

### 3. 多语言内容管理
- 保持中英文内容语义一致
- 标签本地化适配
- 摘要长度控制（建议120字以内）

## 故障排除

### 常见问题

1. **语义化ID验证失败**
   - 检查格式是否符合规范
   - 确认日期格式正确

2. **多语言数据缺失**
   - 运行数据同步脚本
   - 检查语言配置文件

3. **数据不一致**
   - 运行一致性检查
   - 重新同步数据

## 版本历史

- v1.0 (2024-01-15): 初始版本发布
  - 混合存储策略实现
  - 语义化ID系统
  - 多语言支持
  - 数据验证工具

## 贡献指南

1. 遵循现有的数据格式规范
2. 添加新功能时更新配置文件和文档
3. 提交前运行所有验证脚本
4. 保持向后兼容性

## 技术支持

如有问题，请参考：
- 本项目README.md
- 脚本文件内的注释说明
- 配置文件中的示例和说明

---
*最后更新: 2024-01-15*