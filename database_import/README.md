# AI News 数据库导入指南

## 目录结构
```
database_import/
├── news_data.json          # MongoDB 导入数据文件 (30条新闻)
├── import_commands.bat     # Windows 批量导入脚本
├── import_commands.sh      # Linux/Mac 批量导入脚本
└── README.md              # 本说明文档
```

## 数据文件说明

### news_data.json
- 格式：JSON Array
- 包含：30条AI新闻数据
- 数据结构：符合MongoDB News模型
- 字段包括：
  - semanticId (唯一标识)
  - title (中英文标题)
  - summary (中英文摘要)
  - category (分类)
  - readTime (阅读时间)
  - publishTime (发布时间)
  - views (浏览量)
  - comments (评论数)
  - tags (标签)
  - locales (多语言数据)

## 导入方法

### 方法一：使用批量导入脚本 (推荐)

#### Windows 系统
1. 双击运行 `import_commands.bat`
2. 或命令行执行：
   ```cmd
   cd database_import
   import_commands.bat
   ```

#### Linux/Mac 系统
1. 给脚本执行权限：
   ```bash
   chmod +x import_commands.sh
   ```
2. 运行脚本：
   ```bash
   cd database_import
   ./import_commands.sh
   ```

### 方法二：手动使用 mongoimport
```bash
cd database_import
mongoimport --uri="mongodb://localhost:27017/ai-news" --collection=news --file=news_data.json --jsonArray --drop
```

### 方法三：使用 Navicat 导入
1. 打开 Navicat 连接到 MongoDB
2. 选择 `ai-news` 数据库
3. 右键点击 `news` 集合 → 导入
4. 选择文件类型：JSON
5. 选择文件：`news_data.json`
6. 格式选择：JSON Array
7. 点击开始导入

## 环境要求

- MongoDB 4.4+
- MongoDB Database Tools (包含 mongoimport)
- 或 Navicat for MongoDB

## 导入前准备

1. 确保 MongoDB 服务正在运行
2. 确认数据库 `ai-news` 存在
3. 如有旧数据，导入时会自动清空 (--drop 参数)

## 验证导入

导入成功后，可以使用以下命令验证：

```javascript
// 连接到 MongoDB
use ai-news

// 查看数据条数
db.news.countDocuments()

// 查看前5条数据
db.news.find().limit(5).pretty()
```

## 故障排除

### 常见问题
1. **mongoimport 未找到**：安装 [MongoDB Database Tools](https://www.mongodb.com/try/download/database-tools)
2. **连接拒绝**：检查 MongoDB 服务是否启动
3. **认证失败**：如果启用认证，需要在连接字符串中添加用户名密码

### 修改连接字符串
如果需要修改数据库连接，编辑导入脚本中的 `MONGODB_URI`：
- 默认：`mongodb://localhost:27017/ai-news`
- 带认证：`mongodb://username:password@localhost:27017/ai-news`
- 远程服务器：`mongodb://server-ip:27017/ai-news`

## 数据来源

数据来源于 `src/data/newsMasterData.json`，经过格式转换适配 MongoDB 存储。