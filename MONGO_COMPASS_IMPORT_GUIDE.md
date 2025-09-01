# MongoDB Compass 导入指南

## 文件位置
- **JSON 数据文件**: `f:\github\aiNews\mongo_article_import.json`
- **数据库**: `aiNews`
- **集合**: `articles`

## 导入步骤

### 1. 打开 MongoDB Compass
- 启动 MongoDB Compass
- 连接到你的 MongoDB 实例（默认: `mongodb://localhost:27017`）

### 2. 选择数据库和集合
- 在左侧导航栏中选择 `aiNews` 数据库
- 如果 `articles` 集合不存在，Compass 会在导入时自动创建

### 3. 导入 JSON 文件
1. 点击顶部菜单的 "Collection"
2. 选择 "Import Data"
3. 在弹出窗口中，选择 "JSON" 格式
4. 点击 "Select a file" 并选择 `mongo_article_import.json`
5. 确保导入选项设置为：
   - **Input File Type**: JSON
   - **JSON Format**: Standard (Relaxed mode)
6. 点击 "Import"

### 4. 验证导入
- 导入完成后，在 `articles` 集合中应该能看到一条文档
- 文档包含完整的文章数据，包括多语言内容和富文本格式

## 数据结构说明

### 主要字段
| 字段名 | 类型 | 说明 |
|--------|------|------|
| `_id` | ObjectId | 文档唯一标识 |
| `title` | Object | 多语言标题 {zh, en} |
| `summary` | Object | 多语言摘要 {zh, en} |
| `content` | Object | 多语言富文本内容 {zh, en} |
| `category` | ObjectId | 分类ID引用 |
| `tags` | Array[ObjectId] | 标签ID数组 |
| `author` | ObjectId | 作者ID引用 |
| `status` | String | 文章状态（published/draft） |
| `views` | Number | 浏览量 |
| `readTime` | Number | 阅读时间（分钟） |
| `slug` | String | SEO友好的URL标识 |
| `publishedAt` | Date | 发布时间 |
| `metaDescription` | Object | 多语言元描述 {zh, en} |
| `keywords` | Array[String] | 关键词数组 |

### 特殊字段格式
- **ObjectId 引用**: 使用 `{"$oid": "..."}` 格式
- **日期时间**: 使用 `{"$date": "ISO日期字符串"}` 格式
- **多语言内容**: 使用对象结构 `{zh: "内容", en: "内容"}`

## 导入注意事项

1. **文件格式**: 确保JSON文件使用标准的MongoDB扩展JSON格式
2. **集合存在**: 如果 `articles` 集合已存在，导入会追加数据
3. **索引创建**: 导入后建议创建适当的索引：
   ```javascript
   // 文本搜索索引
   db.articles.createIndex({ 
     "title.zh": "text", 
     "title.en": "text", 
     "content.zh": "text", 
     "content.en": "text" 
   })
   
   // 单字段索引
   db.articles.createIndex({ "status": 1 })
   db.articles.createIndex({ "publishedAt": -1 })
   db.articles.createIndex({ "slug": 1 }, { unique: true })
   ```

4. **数据验证**: 导入后检查数据完整性：
   - 多语言字段是否完整
   - 引用字段的ObjectId格式是否正确
   - 日期字段是否解析正确

## 故障排除

### 常见问题
1. **导入失败**: 检查JSON文件格式是否正确
2. **连接错误**: 确认MongoDB服务正在运行
3. **权限问题**: 确保有写入数据库的权限

### 重新导入
如果需要重新导入，先删除现有集合：
```javascript
db.articles.drop()
```
然后重新执行导入步骤。

## 后续操作

导入成功后，你可以：
1. 通过前端应用查看文章
2. 使用API接口获取文章数据
3. 在MongoDB Compass中直接编辑文档
4. 导入更多测试数据