import express from 'express';
const router = express.Router();
import News from '../models/News.js';

// 获取时间轴数据
router.get('/timeline', async (req, res) => {
  try {
    const { limit = 50, importantOnly = false } = req.query;
    
    let query = {};
    if (importantOnly) query.isImportant = true;

    const timeline = await News.find(query)
      .select('title summary publishTime category isImportant')
      .sort({ publishTime: -1 })
      .limit(parseInt(limit));

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;