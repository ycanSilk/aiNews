import express from 'express';
const router = express.Router();
import News from '../models/News.js';

// 获取新闻列表
router.get('/news', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { 'title.zh': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'summary.zh': { $regex: search, $options: 'i' } },
        { 'summary.en': { $regex: search, $options: 'i' } }
      ];
    }

    const news = await News.find(query)
      .sort({ publishTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await News.countDocuments(query);

    res.json({
      data: news,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取单条新闻
router.get('/news/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'News not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;