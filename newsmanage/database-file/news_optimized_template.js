/*
 * 优化后的新闻集合数据模板
 * 解决字段重复和格式不一致问题
 * 基于MongoDB Schema和TypeScript接口设计
 */

// ----------------------------
// Collection structure for news (优化版本)
// ----------------------------
db.getCollection("news").drop();
db.createCollection("news");

// 创建索引（优化版本）
db.getCollection("news").createIndex({
    status: 1,
    publishedAt: -1
}, {
    name: "status_1_publishedAt_-1",
    background: true
});

db.getCollection("news").createIndex({
    featured: 1,
    publishedAt: -1
}, {
    name: "featured_1_publishedAt_-1",
    background: true
});

db.getCollection("news").createIndex({
    views: -1
}, {
    name: "views_-1",
    background: true
});

db.getCollection("news").createIndex({
    semanticId: 1
}, {
    name: "semanticId_1",
    background: true,
    unique: true
});

db.getCollection("news").createIndex({
    category: 1
}, {
    name: "category_1",
    background: true
});

db.getCollection("news").createIndex({
    author: 1
}, {
    name: "author_1",
    background: true
});

db.getCollection("news").createIndex({
    "$**": "text"
}, {
    name: "title_text_content_text_summary_text",
    background: true,
    weights: {
        content: 1,
        summary: 1,
        title: 1
    },
    default_language: "english",
    language_override: "language",
    textIndexVersion: 3
});

// ----------------------------
// 优化的文档结构模板
// ----------------------------
db.getCollection("news").insert([{
    _id: ObjectId("68b1b62cef317d108cc84e0d"),
    semanticId: "openai-gpt-20250829-001",
    
    // 多语言标题（统一使用对象格式）
    title: {
        zh: "OpenAI发布GPT-5预览版，性能提升50%",
        en: "OpenAI Releases GPT-5 Preview with 50% Performance Improvement"
    },
    
    // 多语言摘要
    summary: {
        zh: "OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。据内部测试显示，GPT-5在各项基准测试中的表现比GPT-4提升了约50%。",
        en: "OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation. Internal tests show that GPT-5's performance in various benchmarks is approximately 50% better than GPT-4."
    },
    
    // 内容（支持多语言或统一内容）
    content: {
        zh: "详细的中文内容...",
        en: "Detailed English content..."
    },
    
    // 分类（使用标准化的分类值）
    category: "large-language-models",
    
    // 阅读时间（统一字段名）
    readTime: 3,
    
    // 发布时间相关字段（统一使用publishedAt）
    publishedAt: ISODate("2025-08-29T10:13:25.329Z"),
    
    // 视图计数（统一字段名）
    views: 1250,
    
    // 评论计数（统一字段名）
    comments: 45,
    
    // 状态标记（统一使用布尔值）
    isBreaking: true,
    isImportant: false,
    featured: true,
    
    // 标签（统一使用数组格式）
    tags: ["OpenAI", "GPT-5", "large-language-models"],
    
    // 作者信息（使用ObjectId引用或字符串）
    author: ObjectId("author_id_here"), // 或者 "管理员"
    
    // 状态（统一使用字符串枚举）
    status: "published", // draft | published | archived
    
    // 图片URL
    imageUrl: "https://example.com/image.jpg",
    
    // SEO友好的URL标识
    slug: "openai-gpt-5-preview-release",
    
    // 时间戳（统一使用createdAt和updatedAt）
    createdAt: ISODate("2025-08-29T10:13:25.329Z"),
    updatedAt: ISODate("2025-08-31T05:23:37.780Z"),
    
    // 元数据（可选）
    metadata: {
        source: "官方新闻稿",
        language: "zh",
        wordCount: 850,
        readingLevel: "intermediate"
    }
}]);

// ----------------------------
// 数据迁移脚本（将旧数据转换为新格式）
// ----------------------------

// 1. 统一标题字段格式
// db.getCollection("news").updateMany(
//     { "title": { $type: "string" } },
//     [
//         {
//             $set: {
//                 title: {
//                     zh: "$title",
//                     en: ""
//                 }
//             }
//         }
//     ]
// );

// 2. 统一摘要字段格式
// db.getCollection("news").updateMany(
//     { "summary": { $type: "string" } },
//     [
//         {
//             $set: {
//                 summary: {
//                     zh: "$summary",
//                     en: ""
//                 }
//             }
//         }
//     ]
// );

// 3. 合并重复的视图计数字段
// db.getCollection("news").updateMany(
//     { "views": { $exists: false }, "viewCount": { $exists: true } },
//     [
//         {
//             $set: {
//                 views: "$viewCount"
//             }
//         },
//         {
//             $unset: "viewCount"
//         }
//     ]
// );

// 4. 清理不必要的字段
// db.getCollection("news").updateMany(
//     {},
//     {
//         $unset: {
//             date: "",
//             weekday: "",
//             locales: "",
//             publishTime: ""
//         }
//     }
// );

// 5. 标准化分类值
// db.getCollection("news").updateMany(
//     { category: "大语言模型" },
//     { $set: { category: "large-language-models" } }
// );

// db.getCollection("news").updateMany(
//     { category: "医疗AI" },
//     { $set: { category: "medical-ai" } }
// );

// db.getCollection("news").updateMany(
//     { category: "自动驾驶" },
//     { $set: { category: "autonomous-driving" } }
// );

// db.getCollection("news").updateMany(
//     { category: "硬件" },
//     { $set: { category: "hardware" } }
// );

// db.getCollection("news").updateMany(
//     { category: "科学研究" },
//     { $set: { category: "scientific-research" } }
// );

console.log("优化后的新闻集合模板已创建。请根据需要运行数据迁移脚本。");