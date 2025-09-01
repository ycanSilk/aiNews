# 新闻数据迁移指南

## 问题分析

当前 `news` 集合存在以下数据结构问题：

### 字段重复和不一致
1. **视图计数字段**: `views` 和 `viewCount` 同时存在
2. **时间字段**: `publishTime`、`date`、`weekday`、`createdAt`、`updatedAt` 等多个时间相关字段
3. **多语言处理**: `title`、`summary` 字段同时存在字符串和对象格式
4. **冗余字段**: `locales` 字段包含了重复的多语言信息

### 格式不一致
1. **分类值**: 使用中文分类名称，应该使用标准化的英文值
2. **标签格式**: 有些使用字符串数组，有些使用 JSON 字符串
3. **作者字段**: 有些使用字符串，应该使用 ObjectId 引用

## 优化后的数据结构

### 核心字段（必需）
```javascript
{
  _id: ObjectId,                    // MongoDB 文档ID
  semanticId: string,                // 语义化ID，唯一标识
  title: {                          // 多语言标题
    zh: string,                     // 中文标题
    en: string                      // 英文标题
  },
  summary: {                        // 多语言摘要
    zh: string,                     // 中文摘要
    en: string                      // 英文摘要
  },
  content: {                        // 多语言内容
    zh: string,                     // 中文内容
    en: string                      // 英文内容
  },
  category: string,                 // 标准化分类值
  status: string,                   // 状态: draft | published | archived
  author: ObjectId | string,       // 作者ID或名称
  views: number,                    // 浏览次数
  comments: number,                 // 评论数量
  createdAt: Date,                  // 创建时间
  updatedAt: Date                   // 更新时间
}
```

### 可选字段
```javascript
{
  readTime: number,                 // 阅读时间（分钟）
  publishedAt: Date,                // 发布时间
  isBreaking: boolean,              // 是否突发新闻
  isImportant: boolean,             // 是否重要新闻
  featured: boolean,                // 是否精选
  tags: string[],                   // 标签数组
  imageUrl: string,                 // 图片URL
  slug: string,                     // SEO友好的URL标识
  metadata: {                       // 元数据
    source: string,                 // 来源
    language: string,              // 主要语言
    wordCount: number,             // 字数统计
    readingLevel: string           // 阅读难度
  }
}
```

## 数据迁移步骤

### 1. 备份数据
```bash
# 备份整个数据库
mongodump --uri="mongodb://localhost:27017/ai-news" --out=./backup

# 或者只备份 news 集合
mongodump --uri="mongodb://localhost:27017/ai-news" --collection=news --out=./backup
```

### 2. 运行迁移脚本

使用提供的 `news_optimized_template.js` 文件中的迁移脚本：

```bash
# 连接到 MongoDB 并运行迁移脚本
mongosh "mongodb://localhost:27017/ai-news" news_optimized_template.js
```

### 3. 验证迁移结果

```javascript
// 检查数据完整性
db.news.find().forEach(function(doc) {
  // 确保必需字段存在
  assert(doc.title && typeof doc.title === 'object');
  assert(doc.summary && typeof doc.summary === 'object');
  assert(doc.category && typeof doc.category === 'string');
  assert(doc.status && ['draft', 'published', 'archived'].includes(doc.status));
  assert(doc.views !== undefined);
  assert(doc.createdAt instanceof Date);
  assert(doc.updatedAt instanceof Date);
});

// 检查重复字段已清理
const docsWithOldFields = db.news.find({
  $or: [
    { viewCount: { $exists: true } },
    { date: { $exists: true } },
    { weekday: { $exists: true } },
    { locales: { $exists: true } },
    { publishTime: { $exists: true } }
  ]
}).count();

print(`发现 ${docsWithOldFields} 个文档仍包含旧字段，需要进一步清理。`);
```

## 分类标准化映射

| 原分类值 | 标准化值 | 说明 |
|---------|---------|------|
| 大语言模型 | large-language-models | 大型语言模型相关 |
| 医疗AI | medical-ai | 医疗人工智能 |
| 自动驾驶 | autonomous-driving | 自动驾驶技术 |
| 硬件 | hardware | AI硬件相关 |
| 科学研究 | scientific-research | 科学研究应用 |
| 测试 | test | 测试分类 |

## 应用程序适配

### 前端代码更新
需要更新以下位置的代码以适配新的数据结构：

1. **新闻列表组件**: 适应新的多语言标题格式
2. **新闻详情组件**: 适应新的内容结构
3. **分类筛选**: 使用标准化分类值
4. **搜索功能**: 更新索引字段

### API 接口更新
确保所有 API 端点正确处理新的数据结构：

```typescript
// 示例：获取新闻列表
const response = await fetch('/api/news');
const news = await response.json();

// 使用多语言标题
const title = news[0].title.zh; // 或者 news[0].title.en

// 使用标准化分类
const category = news[0].category;
```

## 回滚方案

如果迁移过程中出现问题，可以恢复备份：

```bash
# 恢复整个数据库
mongorestore --uri="mongodb://localhost:27017/ai-news" ./backup

# 或者只恢复 news 集合
mongorestore --uri="mongodb://localhost:27017/ai-news" --collection=news ./backup/ai-news/news.bson
```

## 性能优化建议

1. **索引优化**: 确保所有查询字段都有适当的索引
2. **数据分片**: 如果数据量巨大，考虑分片策略
3. **缓存策略**: 对频繁访问的数据实施缓存
4. **归档策略**: 对旧新闻实施归档策略

## 监控和维护

迁移后建议监控以下指标：

- 查询性能变化
- 存储空间使用情况
- 应用程序错误率
- 数据一致性

---

**注意**: 在生产环境执行迁移前，务必在测试环境充分测试。