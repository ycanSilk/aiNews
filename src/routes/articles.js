import express from 'express';
const router = express.Router();
import Article from '../models/Article.js';

// 获取文章列表
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, lang = 'zh' } = req.query;
    
    let query = {};
    if (category) query.category = category;

    const articles = await Article.find(query)
      .sort({ publishDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    // 根据语言选择返回相应的字段
    const formattedArticles = articles.map(article => ({
      id: article._id,
      semanticId: article.semanticId,
      coverImage: article.coverImage,
      title: article.title[lang],
      author: article.author[lang],
      date: article.publishDate.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: article.content[lang],
      highlight: article.highlight[lang],
      tags: article.tags,
      views: article.views,
      comments: article.comments,
      isFeatured: article.isFeatured,
      category: article.category
    }));

    res.json({
      data: formattedArticles,
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

// 获取单篇文章
router.get('/articles/:id', async (req, res) => {
  try {
    const { lang = 'zh' } = req.query;
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // 增加阅读量
    article.views += 1;
    await article.save();

    const formattedArticle = {
      id: article._id,
      semanticId: article.semanticId,
      coverImage: article.coverImage,
      title: article.title[lang],
      author: article.author[lang],
      date: article.publishDate.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: article.content[lang],
      highlight: article.highlight[lang],
      tags: article.tags,
      views: article.views,
      comments: article.comments,
      isFeatured: article.isFeatured,
      category: article.category
    };

    res.json(formattedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 根据语义化ID获取文章
router.get('/articles/semantic/:semanticId', async (req, res) => {
  try {
    const { lang = 'zh' } = req.query;
    const article = await Article.findOne({ semanticId: req.params.semanticId });
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // 增加阅读量
    article.views += 1;
    await article.save();

    const formattedArticle = {
      id: article._id,
      semanticId: article.semanticId,
      coverImage: article.coverImage,
      title: article.title[lang],
      author: article.author[lang],
      date: article.publishDate.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      content: article.content[lang],
      highlight: article.highlight[lang],
      tags: article.tags,
      views: article.views,
      comments: article.comments,
      isFeatured: article.isFeatured,
      category: article.category
    };

    res.json(formattedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;