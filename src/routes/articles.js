import express from 'express';
const router = express.Router();
import Article from '../models/Article.js';

// 获取文章列表
router.get('/articles', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      lang = 'ch',
      isHot,
      isRecommended 
    } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (isHot !== undefined) query.isHot = isHot === 'true';
    if (isRecommended !== undefined) query.isRecommended = isRecommended === 'true';

    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('category')
      .populate('tags');

    const total = await Article.countDocuments(query);

    // 根据语言选择返回相应的字段
    const formattedArticles = articles.map(article => ({
      _id: article._id,
      semanticId: article.semanticId,
      coverImage: article.coverImage,
      title: article.title,
      author: article.author,
      content: article.content,
      highlight: article.highlight,
      tags: article.tags,
      category: article.category,
      isHot: article.isHot,
      isRecommended: article.isRecommended,
      viewCount: article.viewCount,
      likeCount: article.likeCount,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    }));

    res.json({
      data: formattedArticles,
      totalCount: total,
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
    const { lang = 'ch' } = req.query;
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
      date: article.publishDate.toLocaleDateString(lang === 'ch' ? 'zh-CN' : 'en-US', {
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
    const { lang = 'ch' } = req.query;
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
      date: article.publishDate.toLocaleDateString(lang === 'ch' ? 'zh-CN' : 'en-US', {
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