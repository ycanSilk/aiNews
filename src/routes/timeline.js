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
      .select('title summary publishTime category isImportant tags semanticId')
      .sort({ publishTime: -1 })
      .limit(parseInt(limit));

    // 转换为Timeline组件需要的格式
    const formattedTimeline = timeline.map((item, index) => ({
      date: item.publishTime ? new Date(item.publishTime).toISOString().split('T')[0] : '2024-01-01',
      title: item.title?.zh || item.title?.en || 'Untitled',
      content: item.summary?.zh || item.summary?.en || 'No content',
      important: item.isImportant || false,
      tags: item.tags || [],
      url: `/cn/article/${item.semanticId}` // 生成正确的文章链接
    }));

    res.json(formattedTimeline);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;