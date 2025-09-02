import express from 'express';
const router = express.Router();
import News from '../models/News.js';
import Category from '../models/Category.js';

// 获取所有分类
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 获取分类统计
router.get('/categories/stats', async (req, res) => {
  try {
    const stats = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;