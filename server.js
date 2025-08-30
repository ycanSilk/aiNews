import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 连接状态监听
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// 路由
import newsRouter from './src/routes/news.js';
import categoriesRouter from './src/routes/categories.js';
import timelineRouter from './src/routes/timeline.js';
import indexRouter from './src/routes/index.js';
import timelineConfigRouter from './src/routes/timeline-config.js';
import articlesRouter from './src/routes/articles.js';
import authRouter from './src/routes/auth.js';
import usersRouter from './src/routes/users.js';

app.use('/api/v1', newsRouter);
app.use('/api/v1', categoriesRouter);
app.use('/api/v1', timelineRouter);
app.use('/api/v1', indexRouter);
app.use('/api/v1', timelineConfigRouter);
app.use('/api/v1', articlesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 客户端路由处理 - 所有非API请求返回index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next(); // 让API路由处理
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});