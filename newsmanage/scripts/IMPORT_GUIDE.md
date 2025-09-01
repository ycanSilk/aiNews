# 📋 优化字段文章数据导入指南

## 🎯 导入内容概述

本导入脚本包含优化后的文章数据，字段映射已根据您的需求进行调整：

### ✅ 包含的字段
- **核心标识**: `_id`, `semanticId`
- **多语言内容**: `title`, `summary`, `content`（中英文）
- **分类信息**: `category`, `author`, `tags`
- **展示数据**: `views`, `imageUrl`, `slug`
- **时间信息**: `publishedAt`, `createdAt`, `updatedAt`
- **状态管理**: `status`

### ❌ 已移除的字段
- `publishTime`, `date`, `weekday`
- `isHot`, `isImportant`, `isCritical`
- `externalUrl`

## 🚀 快速开始

### 方法一：使用批处理脚本（推荐）
```bash
cd scripts
run_import.bat
```

### 方法二：手动执行
```bash
# 安装依赖
npm install mongodb

# 生成导入文件
node import_articles_optimized.js

# 直接导入到数据库
node -e "require('./import_articles_optimized.js').importArticles()"
```

### 方法三：MongoDB Compass 图形界面导入
1. 打开 MongoDB Compass
2. 连接到您的 MongoDB 实例
3. 选择 `ai-news` 数据库
4. 选择 `articles` 集合
5. 点击 "Import Data"
6. 选择生成的 `articles_optimized_import.json` 文件
7. 确认导入选项并执行

## 📊 导入的数据结构

### 文章示例 1
```json
{
  "semanticId": "article-2024-ai-trends",
  "title": {
    "zh": "2024年人工智能发展趋势",
    "en": "AI Trends in 2024"
  },
  "content": {
    "zh": "<h2>2024年人工智能发展趋势</h2><p>随着技术的快速发展...</p>",
    "en": "<h2>AI Trends in 2024</h2><p>With rapid technological development...</p>"
  },
  "views": 1250,
  "status": "published"
}
```

### 文章示例 2（包含富文本多媒体）
```json
{
  "content": {
    "zh": "<h2>多模态AI技术突破</h2><p>最新的多模态模型能够...</p><iframe src=\"https://www.youtube.com/embed/example\" width=\"560\" height=\"315\"></iframe>",
    "en": "<h2>Multimodal AI Technology Breakthrough</h2><p>The latest multimodal models can...</p><iframe src=\"https://www.youtube.com/embed/example\" width=\"560\" height=\"315\"></iframe>"
  }
}
```

## 🔧 富文本内容支持

### 支持的HTML内容
- ✅ 标准HTML标签（h1-h6, p, div, span, etc）
- ✅ YouTube视频嵌入（iframe）
- ✅ 自定义iframe嵌入
- ✅ 代码高亮显示
- ✅ 图片和多媒体内容

### 内容安全
- 建议在服务器端添加HTML净化处理
- 对嵌入内容进行URL验证
- 实现内容大小限制

## 📝 字段映射说明

| 数据库字段 | 显示名称 | 类型 | 必填 | 说明 |
|------------|----------|------|------|------|
| semanticId | 语义ID | String | ✅ | 文章唯一语义标识 |
| title.zh | 中文标题 | String | ✅ | 文章中文标题 |
| title.en | 英文标题 | String | ✅ | 文章英文标题 |
| content.zh | 中文内容 | String | ✅ | 富文本HTML内容 |
| content.en | 英文内容 | String | ✅ | 富文本HTML内容 |
| views | 浏览量 | Number | ✅ | 文章浏览次数 |
| status | 状态 | String | ✅ | draft/published/archived |

## 🛠️ 故障排除

### 常见问题

1. **连接失败**
   - 检查MongoDB服务是否运行
   - 确认连接字符串正确

2. **依赖安装失败**
   - 确保Node.js版本 >= 14
   - 检查网络连接

3. **导入权限问题**
   - 确认数据库用户有写入权限

### 技术支持

如需帮助，请检查：
- MongoDB日志文件
- Node.js错误输出
- 网络连接状态

## 📋 版本历史

- v1.0 (2024-01-15): 初始版本，包含优化字段映射
- v1.1 (2024-01-15): 添加富文本内容支持说明

---

💡 **提示**: 导入前建议备份现有数据，导入操作会清空现有文章集合。