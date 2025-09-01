/*
 Navicat Premium Dump Script

 Source Server         : aiNews
 Source Server Type    : MongoDB
 Source Server Version : 80013 (8.0.13)
 Source Host           : localhost:27017
 Source Schema         : ai-news

 Target Server Type    : MongoDB
 Target Server Version : 80013 (8.0.13)
 File Encoding         : 65001

 Date: 01/09/2025 23:11:46
*/


// ----------------------------
// Collection structure for articles
// ----------------------------
db.getCollection("articles").drop();
db.createCollection("articles");
db.getCollection("articles").createIndex({
    semanticId: Int32("1")
}, {
    name: "semanticId_1",
    background: true,
    unique: true
});
db.getCollection("articles").createIndex({
    category: Int32("1")
}, {
    name: "category_1",
    background: true
});
db.getCollection("articles").createIndex({
    isPublished: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isPublished_1_publishTime_-1",
    background: true
});
db.getCollection("articles").createIndex({
    isHot: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isHot_1_publishTime_-1",
    background: true
});
db.getCollection("articles").createIndex({
    isRecommended: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isRecommended_1_publishTime_-1",
    background: true
});
db.getCollection("articles").createIndex({
    viewCount: Int32("-1")
}, {
    name: "viewCount_-1",
    background: true
});
db.getCollection("articles").createIndex({
    tags: Int32("1")
}, {
    name: "tags_1",
    background: true
});
db.getCollection("articles").createIndex({
    author: Int32("1")
}, {
    name: "author_1",
    background: true
});
db.getCollection("articles").createIndex({
    status: Int32("1")
}, {
    name: "status_1",
    background: true
});
db.getCollection("articles").createIndex({
    publishedAt: Int32("1")
}, {
    name: "publishedAt_1",
    background: true
});
db.getCollection("articles").createIndex({
    views: Int32("1")
}, {
    name: "views_1",
    background: true
});
db.getCollection("articles").createIndex({
    slug: Int32("1")
}, {
    name: "slug_1",
    background: true,
    unique: true
});
db.getCollection("articles").createIndex({
    isHot: Int32("1")
}, {
    name: "isHot_1",
    background: true
});
db.getCollection("articles").createIndex({
    isImportant: Int32("1")
}, {
    name: "isImportant_1",
    background: true
});
db.getCollection("articles").createIndex({
    isCritical: Int32("1")
}, {
    name: "isCritical_1",
    background: true
});
db.getCollection("articles").createIndex({
    "$**": "text"
}, {
    name: "title.zh_text_title.en_text_summary.zh_text_summary.en_text_content.zh_text_content.en_text",
    background: true,
    weights: {
        "content.en": Int32("1"),
        "content.zh": Int32("1"),
        "summary.en": Int32("1"),
        "summary.zh": Int32("1"),
        "title.en": Int32("1"),
        "title.zh": Int32("1")
    },
    default_language: "english",
    language_override: "language",
    textIndexVersion: Int32("3")
});
db.getCollection("articles").createIndex({
    status: Int32("1"),
    publishedAt: Int32("-1")
}, {
    name: "status_1_publishedAt_-1",
    background: true
});
db.getCollection("articles").createIndex({
    category: Int32("1"),
    status: Int32("1")
}, {
    name: "category_1_status_1",
    background: true
});
db.getCollection("articles").createIndex({
    author: Int32("1"),
    status: Int32("1")
}, {
    name: "author_1_status_1",
    background: true
});
db.getCollection("articles").createIndex({
    isHot: Int32("1"),
    publishedAt: Int32("-1")
}, {
    name: "isHot_1_publishedAt_-1",
    background: true
});
db.getCollection("articles").createIndex({
    isImportant: Int32("1"),
    publishedAt: Int32("-1")
}, {
    name: "isImportant_1_publishedAt_-1",
    background: true
});

// ----------------------------
// Documents of articles
// ----------------------------
db.getCollection("articles").insert([ {
    _id: ObjectId("67a1b2c3d4e5f67890123456"),
    semanticId: "ai-news-001",
    title: {
        zh: "人工智能新闻标题",
        en: "AI News Title"
    },
    summary: {
        zh: "这是人工智能新闻的摘要内容",
        en: "This is the summary of AI news"
    },
    content: {
        zh: "<h1>人工智能新闻内容</h1><p>这是详细的人工智能新闻内容，包含丰富的HTML格式。</p><ul><li>列表项1</li><li>列表项2</li></ul>",
        en: "<h1>AI News Content</h1><p>This is detailed AI news content with rich HTML formatting.</p><ul><li>Item 1</li><li>Item 2</li></ul>"
    },
    category: "technology",
    author: "AI Writer",
    status: "published",
    tags: [
        "AI",
        "Technology",
        "News"
    ],
    sourceUrl: "https://example.com/ai-news",
    slug: "ai-news-2024",
    featuredImage: "",
    isFeatured: false,
    views: Int32("0"),
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("67a1b2c3d4e5f67890123457"),
    semanticId: "tech-review-002",
    title: {
        zh: "技术评测：最新AI工具",
        en: "Tech Review: Latest AI Tools"
    },
    summary: {
        zh: "对最新AI工具的综合评测",
        en: "Comprehensive review of the latest AI tools"
    },
    content: {
        zh: "<h2>技术评测详情</h2><p>详细的技术评测内容...</p><blockquote>引用重要的技术观点</blockquote>",
        en: "<h2>Tech Review Details</h2><p>Detailed technical review content...</p><blockquote>Quote important technical insights</blockquote>"
    },
    category: "review",
    author: "Tech Reviewer",
    status: "draft",
    tags: [
        "Review",
        "AI Tools",
        "Technology"
    ],
    sourceUrl: "https://example.com/tech-review",
    slug: "tech-review-latest-ai-tools",
    featuredImage: "",
    isFeatured: true,
    views: Int32("150"),
    createdAt: "2024-01-14T15:45:00.000Z",
    updatedAt: "2024-01-15T09:20:00.000Z"
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("68b5b2d231df416723dea3d7"),
    semanticId: "sdafsad",
    title: {
        zh: "撒旦法阿是",
        en: "sada"
    },
    summary: {
        zh: "撒旦法时代",
        en: "asdfa"
    },
    content: {
        zh: "<p>撒旦法时代</p>",
        en: "<p>sdafas</p>"
    },
    category: ObjectId("68b43d4125a9b690fea83cf7"),
    tags: [ ],
    author: ObjectId("68b30c5a08d6d3af65debbaa"),
    status: "draft",
    publishedAt: ISODate("2025-09-01T00:00:00.000Z"),
    views: Int32("0"),
    readTime: Int32("1"),
    imageUrl: "",
    slug: "dsf",
    isHot: false,
    isImportant: false,
    isCritical: false,
    featuredImage: "",
    relatedArticles: [ ],
    sourceUrl: "",
    isFeatured: true,
    createdAt: ISODate("2025-09-01T14:50:58.623Z"),
    updatedAt: ISODate("2025-09-01T14:50:58.623Z"),
    __v: Int32("0")
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("68b5b64cead7e3e35fc99853"),
    semanticId: "test-article-2",
    title: {
        zh: "测试文章2",
        en: "Test Article 2"
    },
    summary: {
        zh: "测试摘要2",
        en: "Test Summary 2"
    },
    content: {
        zh: "<p>测试内容2</p>",
        en: "<p>Test Content 2</p>"
    },
    category: ObjectId("68b463bdbebcdf7ee30ced5c"),
    tags: [ ],
    author: ObjectId("68b30c5a08d6d3af65debbaa"),
    status: "draft",
    publishedAt: ISODate("2025-09-01T00:00:00.000Z"),
    views: Int32("0"),
    readTime: Int32("1"),
    slug: "test-article-2",
    isHot: false,
    isImportant: false,
    isCritical: false,
    relatedArticles: [ ],
    isFeatured: false,
    createdAt: ISODate("2025-09-01T15:05:48.585Z"),
    updatedAt: ISODate("2025-09-01T15:05:48.585Z"),
    __v: Int32("0")
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("68b5b652ead7e3e35fc99857"),
    semanticId: "asdas",
    title: {
        zh: "asdas",
        en: "asdas"
    },
    summary: {
        zh: "asdas",
        en: "asdas"
    },
    content: {
        zh: "<p>asdas</p>",
        en: "<p>asdas</p>"
    },
    category: ObjectId("68b46409bebcdf7ee30ced60"),
    tags: [ ],
    author: ObjectId("68b30c5a08d6d3af65debbaa"),
    status: "draft",
    publishedAt: ISODate("2025-09-01T00:00:00.000Z"),
    views: Int32("0"),
    readTime: Int32("1"),
    slug: "asdas",
    isHot: false,
    isImportant: false,
    isCritical: false,
    relatedArticles: [ ],
    isFeatured: true,
    createdAt: ISODate("2025-09-01T15:05:54.51Z"),
    updatedAt: ISODate("2025-09-01T15:05:54.51Z"),
    __v: Int32("0")
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("68b5b68fead7e3e35fc9986f"),
    semanticId: "test-article-4",
    title: {
        zh: "测试文章4",
        en: "Test Article 4"
    },
    summary: {
        zh: "测试摘要4",
        en: "Test Summary 4"
    },
    content: {
        zh: "<p>测试内容4</p>",
        en: "<p>Test Content 4</p>"
    },
    category: ObjectId("68b463bdbebcdf7ee30ced5c"),
    tags: [
        ObjectId("68b5b68fead7e3e35fc9986d"),
        ObjectId("68b5b68fead7e3e35fc9986e")
    ],
    author: ObjectId("68b30c5a08d6d3af65debbaa"),
    status: "draft",
    publishedAt: ISODate("2025-09-01T00:00:00.000Z"),
    views: Int32("0"),
    readTime: Int32("1"),
    slug: "test-article-4",
    isHot: false,
    isImportant: false,
    isCritical: false,
    relatedArticles: [ ],
    isFeatured: false,
    createdAt: ISODate("2025-09-01T15:06:55.098Z"),
    updatedAt: ISODate("2025-09-01T15:06:55.098Z"),
    __v: Int32("0")
} ]);
db.getCollection("articles").insert([ {
    _id: ObjectId("68b5b6c2ead7e3e35fc99879"),
    semanticId: "asdasdas",
    title: {
        zh: "dasas",
        en: "dasdasas"
    },
    summary: {
        zh: "daasdasd",
        en: "asd"
    },
    content: {
        zh: "<p>adsfasdfasd</p>",
        en: "<p>asdfasdf</p>"
    },
    category: ObjectId("68b463eabebcdf7ee30ced5e"),
    tags: [
        ObjectId("68b5b6c2ead7e3e35fc99878")
    ],
    author: ObjectId("68b30c5a08d6d3af65debbaa"),
    status: "draft",
    publishedAt: ISODate("2025-09-01T00:00:00.000Z"),
    views: Int32("0"),
    readTime: Int32("1"),
    slug: "sadfsadf",
    isHot: false,
    isImportant: false,
    isCritical: false,
    relatedArticles: [ ],
    isFeatured: true,
    createdAt: ISODate("2025-09-01T15:07:46.793Z"),
    updatedAt: ISODate("2025-09-01T15:07:46.793Z"),
    __v: Int32("0")
} ]);
