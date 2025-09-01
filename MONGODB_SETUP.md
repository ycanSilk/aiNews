# MongoDB 集成指南

## 🚀 快速开始

### 1. 确保MongoDB服务运行
```bash
# 检查MongoDB服务状态
mongod --version

# 启动MongoDB服务（Windows）
net start MongoDB

# 或者使用MongoDB Compass连接
```

### 2. 安装后端依赖（已完成）
```bash
npm install
```

### 3. 数据迁移
```bash
# 将现有JSON数据迁移到MongoDB
npm run db:migrate
```

### 4. 启动后端服务器
```bash
# 生产模式
npm run server

# 开发模式（推荐）
 npm run server:dev
```

## 📊 数据库结构

### News 集合结构（基础版）
```javascript
{
  semanticId: String,      // 语义ID
  title: {
    zh: String,           // 中文标题
    en: String            // 英文标题
  },
  summary: {
    zh: String,           // 中文摘要
    en: String            // 英文摘要
  },
  content: {
    zh: String,           // 中文内容（富文本HTML）
    en: String            // 英文内容（富文本HTML）
  },
  category: String,       // 分类
  readTime: Number,       // 阅读时间
  publishedAt: Date,      // 发布时间
  views: Number,          // 浏览量
  tags: [String],         // 标签数组
  isHot: Boolean,         // 热门标记
  isImportant: Boolean,   // 重要标记
  isCritical: Boolean,    // 关键标记
  externalUrl: String,    // 外部链接
  createdAt: Date,        // 创建时间
  updatedAt: Date         // 更新时间
}
```

### Article 集合结构（高级版 - 支持富文本）
```javascript
{
  semanticId: String,      // 语义ID
  title: { zh: String, en: String },           // 多语言标题
  summary: { zh: String, en: String },         // 多语言摘要
  content: { zh: String, en: String },          // 多语言富文本内容
  category: ObjectId,                          // 分类引用
  tags: [ObjectId],                            // 标签引用数组
  author: ObjectId,                            // 作者引用
  status: 'draft' | 'published' | 'archived',  // 状态
  publishedAt: Date,                           // 发布时间
  views: Number,                               // 浏览量
  readTime: Number,                            // 阅读时间
  imageUrl: String,                            // 主图URL
  slug: String,                                // URL标识
  isHot: Boolean,                              // 热门标记
  isImportant: Boolean,                        // 重要标记
  isCritical: Boolean,                         // 关键标记
  externalUrl: String,                         // 外部链接
  featuredImage: {                            // 特色图片
    url: String,
    alt: String,
    caption: String
  },
  seo: {                                       // SEO优化
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  relatedArticles: [ObjectId],                 // 相关文章
  createdAt: Date,                             // 创建时间
  updatedAt: Date                              // 更新时间
}
```

## 🌐 API 端点

### 新闻相关
- `GET /api/v1/news` - 获取新闻列表
- `GET /api/v1/news/:id` - 获取单条新闻
- `GET /api/v1/articles` - 获取文章列表（支持富文本）
- `GET /api/v1/articles/:id` - 获取单篇文章（支持富文本）

### 分类相关
- `GET /api/v1/categories` - 获取所有分类
- `GET /api/v1/categories/stats` - 获取分类统计

### 时间轴
- `GET /api/v1/timeline` - 获取时间轴数据

### 健康检查
- `GET /health` - 服务健康状态

## 🔧 查询参数

### 新闻列表查询
```bash
# 基本查询
GET /api/v1/news

# 分页查询
GET /api/v1/news?page=2&limit=10

# 分类过滤
GET /api/v1/news?category=技术

# 搜索查询
GET /api/v1/news?search=OpenAI

# 组合查询
GET /api/v1/news?category=技术&page=1&limit=20&search=GPT
```

## 🛠️ 开发命令

```bash
# 启动开发服务器（带热重载）
npm run server:dev

# 启动生产服务器
npm run server

# 数据迁移
npm run db:migrate

# 前端开发服务器
npm run dev
```

## 📝 环境配置

创建 `.env` 文件：
```env
MONGODB_URI=mongodb://localhost:27017/ai-news
PORT=3000
NODE_ENV=development
```

## 🔍 故障排除

### MongoDB 连接问题
1. 确保MongoDB服务正在运行
2. 检查连接字符串：`mongodb://localhost:27017/ai-news`
3. 验证端口27017是否可用

### 数据迁移问题
1. 确保JSON数据文件存在且格式正确
2. 检查文件路径是否正确

### API 访问问题
1. 确保后端服务器运行在端口3000
2. 检查CORS配置

## 📈 性能优化

1. **索引优化**：为常用查询字段创建索引
2. **分页查询**：使用limit和skip进行分页
3. **字段选择**：使用select()只返回需要的字段
4. **缓存策略**：实现API响应缓存

## 🚀 下一步计划

1. 实现用户认证系统
2. 添加新闻管理后台
3. 实现实时通知功能
4. 添加数据分析仪表板
5. 部署到生产环境