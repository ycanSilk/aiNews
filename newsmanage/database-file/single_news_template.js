/*
 * 单条新闻数据模板
 * 用于清空news集合后重新导入
 */

// 清空现有news集合
db.news.drop();

// 重新创建news集合
db.createCollection("news");

// 创建必要的索引
db.news.createIndex({ semanticId: 1 }, { unique: true });
db.news.createIndex({ status: 1 });
db.news.createIndex({ category: 1 });
db.news.createIndex({ author: 1 });
db.news.createIndex({ "title.zh": "text", "content.zh": "text", "summary.zh": "text" });

// 插入单条示例新闻数据
db.news.insert({
    semanticId: "openai-gpt-20250901-001",
    
    // 多语言标题
    title: {
        zh: "OpenAI发布GPT-5预览版，性能提升50%",
        en: "OpenAI Releases GPT-5 Preview with 50% Performance Improvement"
    },
    
    // 多语言摘要
    summary: {
        zh: "OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。",
        en: "OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation."
    },
    
    // 多语言内容
    content: {
        zh: "OpenAI今日正式发布了GPT-5的预览版本，这是人工智能领域的又一重大突破。据官方介绍，GPT-5在多项基准测试中的表现比GPT-4提升了约50%，特别是在复杂推理、创意写作和代码生成方面有了显著改进。新模型采用了更先进的训练技术和更大的参数规模，能够更好地理解上下文和生成更准确的回应。GPT-5还增强了多语言处理能力，支持更多语言的高质量生成。目前该版本已向部分开发者和企业用户开放测试，预计在未来几个月内逐步向更广泛的用户群体推出。",
        en: "OpenAI today officially released the preview version of GPT-5, marking another major breakthrough in the field of artificial intelligence. According to official introduction, GPT-5's performance in various benchmark tests is approximately 50% better than GPT-4, with significant improvements particularly in complex reasoning, creative writing, and code generation. The new model adopts more advanced training techniques and larger parameter scale, enabling better context understanding and more accurate response generation. GPT-5 also enhances multilingual processing capabilities, supporting high-quality generation in more languages. The version is currently available for testing by selected developers and enterprise users, with plans to gradually roll out to broader user base in the coming months."
    },
    
    // 分类（使用标准化值）
    category: "large-language-models",
    
    
    // 状态
    status: "published",
    
    // 作者信息
    author: "admin",
    
    // 视图和评论计数
    views: 1250,
    comments: 0,
    
    // 状态标记
    isBreaking: true,
    isImportant: true,
    featured: true,
    
    // 标签
    tags: ["OpenAI", "GPT-5", "AI", "大语言模型"],
    
    // 图片URL
    imageUrl: "https://example.com/images/gpt-5-preview.jpg",
    
    // SEO友好的URL标识
    slug: "openai-gpt-5-preview-release",
    
    // 时间信息
    publishedAt: new Date("2025-09-01T10:00:00Z"),
    createdAt: new Date("2025-09-01T09:30:00Z"),
    updatedAt: new Date("2025-09-01T09:30:00Z"),
    
    // 元数据（可选）
    metadata: {
        source: "OpenAI官方新闻稿",
        language: "en",
        wordCount: 350,
        readingLevel: "intermediate"
    }
});

print("新闻集合已清空并重新创建");
print("已插入1条示例新闻数据");
print("语义化ID: openai-gpt-20250901-001");
print("标题: OpenAI发布GPT-5预览版，性能提升50%");
print("运行完成！");