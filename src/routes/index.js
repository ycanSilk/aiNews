import express from 'express';
const router = express.Router();

// 获取首页数据（替代静态index.json）
router.get('/index', async (req, res) => {
  try {
    // 返回模拟的首页配置数据
    const indexData = {
      title: {
        ch: "AI新闻时间轴",
        en: "AI News Timeline"
      },
      description: {
        ch: "追踪人工智能领域的最新发展和重要事件",
        en: "Tracking the latest developments and important events in the field of artificial intelligence"
      },
      keywords: {
        ch: "人工智能,AI,机器学习,深度学习,新闻",
        en: "Artificial Intelligence, AI, Machine Learning, Deep Learning, News"
      },
      footer: {
        ch: "© 2024 AI新闻时间轴. 保留所有权利。",
        en: "© 2024 AI News Timeline. All rights reserved."
      },
      languages: [
        { code: 'ch', name: '中文' },
        { code: 'en', name: 'English' }
      ],
      defaultLanguage: 'ch'
    };

    res.json(indexData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;