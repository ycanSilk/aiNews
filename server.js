import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

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

app.use('/api/v1', newsRouter);
app.use('/api/v1', categoriesRouter);
app.use('/api/v1', timelineRouter);
app.use('/api/v1', indexRouter);
app.use('/api/v1', timelineConfigRouter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});