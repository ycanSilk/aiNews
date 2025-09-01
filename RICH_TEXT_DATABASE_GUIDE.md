# 富文本内容数据库设计指南

## 📋 概述

本文档详细说明了如何设计MongoDB数据库结构以支持富文本编辑器内容存储，基于Tiptap编辑器生成的HTML内容。

## 🏗️ 数据库结构设计

### Article 集合（核心表）
```javascript
{
  semanticId: "article-2024-ai-trends",        // 语义化ID
  title: {
    zh: "2024年人工智能发展趋势",              // 中文标题
    en: "AI Trends in 2024"                   // 英文标题
  },
  summary: {
    zh: "本文探讨2024年人工智能领域的最新发展趋势...",
    en: "This article explores the latest AI trends in 2024..."
  },
  content: {
    zh: "<h2>2024年人工智能发展趋势</h2><p>随着技术的快速发展...</p>",
    en: "<h2>AI Trends in 2024</h2><p>With rapid technological development...</p>"
  },
  category: ObjectId("67890abcde12345f67890ab"), // 分类引用
  tags: [ObjectId("12345abcde67890f12345ab")],   // 标签引用数组
  author: ObjectId("abcdef1234567890abcdef12"),  // 作者引用
  status: "published",                          // 状态：draft/published/archived
  publishedAt: ISODate("2024-01-15T10:30:00Z"), // 发布时间
  views: 1250,                                  // 浏览量
  readTime: 8,                                  // 阅读时间（分钟）
  imageUrl: "/images/ai-trends-2024.jpg",       // 主图URL
  slug: "2024-ai-trends",                       // URL友好标识
  isHot: true,                                  // 热门标记
  isImportant: false,                           // 重要标记
  isCritical: true,                            // 关键标记
  externalUrl: "https://example.com/external",  // 外部链接
  featuredImage: {                              // 特色图片
    url: "/images/featured/ai-trends.jpg",
    alt: "人工智能发展趋势",
    caption: "2024年AI技术发展预测"
  },
  seo: {                                        // SEO优化
    metaTitle: "2024 AI趋势 | 人工智能发展",
    metaDescription: "深入了解2024年人工智能领域的最新发展趋势和技术突破",
    keywords: ["人工智能", "AI", "2024趋势", "技术发展"]
  },
  relatedArticles: [                            // 相关文章
    ObjectId("78901bcdef23456g78901bc")
  ],
  createdAt: ISODate("2024-01-10T08:00:00Z"),   // 创建时间
  updatedAt: ISODate("2024-01-15T10:30:00Z")    // 更新时间
}
```

## 🎯 富文本内容存储策略

### 1. HTML内容存储
- **格式**: 直接存储Tiptap编辑器生成的HTML
- **优势**: 保持完整的格式和样式信息
- **示例**: 
```html
<h2>章节标题</h2>
<p>这是一个<strong>加粗</strong>的段落。</p>
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>
<table>
  <tr><th>表头</th><th>表头2</th></tr>
  <tr><td>数据1</td><td>数据2</td></tr>
</table>
```

### 2. 多语言支持
- 中英文内容分别存储
- 独立的HTML结构
- 支持语言特定的格式需求

### 3. 媒体资源处理
- **图片**: 存储相对URL路径
- **表格**: 完整HTML表格结构
- **链接**: 保持完整的<a>标签结构

## 🔍 索引优化

### 全文搜索索引
```javascript
// 支持中英文全文搜索
db.articles.createIndex({
  "title.zh": "text",
  "title.en": "text", 
  "summary.zh": "text",
  "summary.en": "text",
  "content.zh": "text",
  "content.en": "text"
})
```

### 复合索引
```javascript
// 状态和发布时间
db.articles.createIndex({ status: 1, publishedAt: -1 })

// 分类和状态  
db.articles.createIndex({ category: 1, status: 1 })

// 作者和状态
db.articles.createIndex({ author: 1, status: 1 })

// 热门文章
db.articles.createIndex({ isHot: 1, publishedAt: -1 })
```

## 🛠️ 查询示例

### 1. 获取已发布的文章
```javascript
db.articles.find({ 
  status: "published", 
  publishedAt: { $lte: new Date() } 
}).sort({ publishedAt: -1 })
```

### 2. 全文搜索
```javascript
db.articles.find({
  $text: { $search: "人工智能 发展" },
  status: "published"
}).sort({ score: { $meta: "textScore" } })
```

### 3. 分类筛选
```javascript
db.articles.find({
  category: ObjectId("67890abcde12345f67890ab"),
  status: "published"
}).sort({ publishedAt: -1 })
```

## 💾 存储考虑

### 优点
- ✅ 完整的格式保留
- ✅ 直接前端渲染
- ✅ 简单的存储结构
- ✅ 良好的查询性能

### 注意事项
- ⚠️ HTML内容可能较大
- ⚠️ 需要适当的索引策略
- ⚠️ 考虑内容清理（XSS防护）

## 🔒 安全考虑

### 1. XSS防护
```javascript
// 服务端内容清理
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(articleContent);
```

### 2. 输入验证
- 验证HTML结构完整性
- 限制特定标签和属性
- 验证URL格式

## 📈 性能优化

### 1. 分页查询
```javascript
// 使用skip和limit进行分页
db.articles.find({ status: "published" })
  .skip((page - 1) * limit)
  .limit(limit)
  .sort({ publishedAt: -1 })
```

### 2. 字段选择
```javascript
// 只返回需要的字段
db.articles.find({}, {
  title: 1,
  summary: 1,
  publishedAt: 1,
  imageUrl: 1
})
```

## 🚀 部署建议

### 1. 数据库配置
```yaml
# MongoDB配置
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 2
```

### 2. 备份策略
- 定期备份articles集合
- 使用mongodump进行全量备份
- 考虑增量备份策略

## 📊 监控指标

- 平均文档大小
- 查询响应时间
- 索引命中率
- 存储空间使用

## 🔧 故障排除

### 常见问题
1. **文档过大**: 考虑拆分内容或使用GridFS
2. **查询慢**: 检查索引使用情况
3. **存储不足**: 监控磁盘空间使用

### 性能调优
- 添加合适的索引
- 优化查询语句
- 考虑分片集群（大规模部署）

---

## 🎯 总结

这个数据库结构设计充分考虑了富文本内容的存储需求，提供了：

1. **完整的格式支持**: HTML直接存储确保格式完整性
2. **多语言能力**: 独立的中英文内容存储
3. **性能优化**: 合理的索引策略和查询优化
4. **扩展性**: 支持SEO、相关文章等扩展功能
5. **安全性**: XSS防护和输入验证机制

适用于新闻发布系统、博客平台、内容管理系统等需要富文本编辑功能的场景。