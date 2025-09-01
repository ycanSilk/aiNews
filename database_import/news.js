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

 Date: 01/09/2025 11:17:17
*/


// ----------------------------
// Collection structure for news
// ----------------------------
db.getCollection("news").drop();
db.createCollection("news");
db.getCollection("news").createIndex({
    isHot: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isHot_1_publishTime_-1",
    background: true
});
db.getCollection("news").createIndex({
    isRecommended: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isRecommended_1_publishTime_-1",
    background: true
});
db.getCollection("news").createIndex({
    viewCount: Int32("-1")
}, {
    name: "viewCount_-1",
    background: true
});
db.getCollection("news").createIndex({
    semanticId: Int32("1")
}, {
    name: "semanticId_1",
    background: true,
    unique: true
});
db.getCollection("news").createIndex({
    category: Int32("1")
}, {
    name: "category_1",
    background: true
});
db.getCollection("news").createIndex({
    isPublished: Int32("1"),
    publishTime: Int32("-1")
}, {
    name: "isPublished_1_publishTime_-1",
    background: true
});
db.getCollection("news").createIndex({
    "$**": "text"
}, {
    name: "title_text_content_text_summary_text",
    background: true,
    weights: {
        content: Int32("1"),
        summary: Int32("1"),
        title: Int32("1")
    },
    default_language: "english",
    language_override: "language",
    textIndexVersion: Int32("3")
});
db.getCollection("news").createIndex({
    status: Int32("1")
}, {
    name: "status_1",
    background: true
});
db.getCollection("news").createIndex({
    publishedAt: Int32("1")
}, {
    name: "publishedAt_1",
    background: true
});
db.getCollection("news").createIndex({
    featured: Int32("1")
}, {
    name: "featured_1",
    background: true
});
db.getCollection("news").createIndex({
    author: Int32("1")
}, {
    name: "author_1",
    background: true
});

// ----------------------------
// Documents of news
// ----------------------------
db.getCollection("news").insert([ {
    _id: "{\"$oid\":\"68b1b62cef317d108cc84e0d\"}",
    semanticId: "openai-gpt-20250829-001",
    title: "{\"zh\":\"OpenAI发布GPT-5预览版，性能提升50%\",\"en\":\"OpenAI Releases GPT-5 Preview with 50% Performance Improvement\"}",
    summary: "{\"zh\":\"OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。据内部测试显示，GPT-5在各项基准测试中的表现比GPT-4提升了约50%。\",\"en\":\"OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation. Internal tests show that GPT-5's performance in various benchmarks is approximately 50% better than GPT-4.\"}",
    category: "大语言模型",
    readTime: Int32("3"),
    publishTime: ISODate("1970-01-01T10:13:25.329Z"),
    date: "2025-08-29",
    views: Int32("1250"),
    comments: Int32("45"),
    isBreaking: true,
    isImportant: false,
    tags: "[\"OpenAI\",\"GPT-5\",\"大语言模型\"]",
    locales: "{\"zh\":{\"title\":\"OpenAI发布GPT-5预览版，性能提升50%\",\"summary\":\"OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。据内部测试显示，GPT-5在各项基准测试中的表现比GPT-4提升了约50%。\",\"tags\":[\"OpenAI\",\"GPT-5\",\"大语言模型\"]},\"en\":{\"title\":\"OpenAI Releases GPT-5 Preview with 50% Performance Improvement\",\"summary\":\"OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation. Internal tests show that GPT-5's performance in various benchmarks is approximately 50% better than GPT-4.\",\"tags\":[]}}",
    updatedAt: ISODate("2025-08-31T05:23:37.78Z"),
    weekday: "Thursday"
} ]);
db.getCollection("news").insert([ {
    _id: "{\"$oid\":\"68b1b62cef317d108cc84e0e\"}",
    semanticId: "google-gemini-20250829-002",
    title: "{\"zh\":\"谷歌Gemini Ultra在医疗诊断领域取得突破\",\"en\":\"Google's Gemini Ultra Achieves Breakthrough in Medical Diagnosis\"}",
    summary: "{\"zh\":\"谷歌最新的Gemini Ultra模型在医疗影像分析方面表现出色，能够准确识别早期癌症病变，准确率达到96.7%。这一突破有望革命性地改变医疗诊断领域。\",\"en\":\"Google's latest Gemini Ultra model excels in medical image analysis, accurately identifying early-stage cancer lesions with an accuracy rate of 96.7%. This breakthrough promises to revolutionize the field of medical diagnosis.\"}",
    category: "医疗AI",
    readTime: Int32("5"),
    publishTime: ISODate("1970-01-01T08:13:25.329Z"),
    date: "2025-08-29",
    views: Int32("890"),
    comments: Int32("32"),
    isBreaking: false,
    isImportant: false,
    tags: "[\"谷歌\",\"Gemini\",\"医疗AI\"]",
    locales: "{\"zh\":{\"title\":\"谷歌Gemini Ultra在医疗诊断领域取得突破\",\"summary\":\"谷歌最新的Gemini Ultra模型在医疗影像分析方面表现出色，能够准确识别早期癌症病变，准确率达到96.7%。这一突破有望革命性地改变医疗诊断领域。\",\"tags\":[\"谷歌\",\"Gemini\",\"医疗AI\"]},\"en\":{\"title\":\"Google's Gemini Ultra Achieves Breakthrough in Medical Diagnosis\",\"summary\":\"Google's latest Gemini Ultra model excels in medical image analysis, accurately identifying early-stage cancer lesions with an accuracy rate of 96.7%. This breakthrough promises to revolutionize the field of medical diagnosis.\",\"tags\":[]}}",
    updatedAt: ISODate("2025-08-31T05:23:37.78Z"),
    weekday: "Thursday"
} ]);
db.getCollection("news").insert([ {
    _id: "{\"$oid\":\"68b1b62cef317d108cc84e0f\"}",
    semanticId: "ai-news-20250829-003",
    title: "{\"zh\":\"自动驾驶汽车在城市测试中达到新里程碑\",\"en\":\"Autonomous Vehicles Reach New Milestone in Urban Testing\"}",
    summary: "{\"zh\":\"特斯拉FSD系统在复杂城市环境中完成了10万公里无人工干预驾驶测试，标志着自动驾驶技术迈向商业化应用的重要一步。\",\"en\":\"Tesla's FSD system has completed 100,000 kilometers of driverless testing in complex urban environments without human intervention, marking a significant step towards the commercial application of autonomous driving technology.\"}",
    category: "自动驾驶",
    readTime: Int32("4"),
    publishTime: ISODate("1970-01-01T06:13:25.329Z"),
    date: "2025-08-29",
    views: Int32("756"),
    comments: Int32("28"),
    isBreaking: false,
    isImportant: false,
    tags: "[\"特斯拉\",\"自动驾驶\",\"FSD\"]",
    locales: "{\"zh\":{\"title\":\"自动驾驶汽车在城市测试中达到新里程碑\",\"summary\":\"特斯拉FSD系统在复杂城市环境中完成了10万公里无人工干预驾驶测试，标志着自动驾驶技术迈向商业化应用的重要一步。\",\"tags\":[\"特斯拉\",\"自动驾驶\",\"FSD\"]},\"en\":{\"title\":\"Autonomous Vehicles Reach New Milestone in Urban Testing\",\"summary\":\"Tesla's FSD system has completed 100,000 kilometers of driverless testing in complex urban environments without human intervention, marking a significant step towards the commercial application of autonomous driving technology.\",\"tags\":[]}}",
    updatedAt: ISODate("2025-08-31T05:23:37.78Z"),
    weekday: "Thursday"
} ]);
db.getCollection("news").insert([ {
    _id: "{\"$oid\":\"68b1b62cef317d108cc84e10\"}",
    semanticId: "ai-news-20250829-004",
    title: "{\"zh\":\"AI芯片市场预计2025年增长40%\",\"en\":\"AI Chip Market Expected to Grow 40% in 2025\"}",
    summary: "{\"zh\":\"根据最新市场报告，全球AI芯片市场预计在2025年将达到650亿美元，同比增长40%。NVIDIA、AMD和英特尔等公司正在加大投资力度。\",\"en\":\"According to the latest market report, the global AI chip market is expected to reach $65 billion in 2025, with rapid year-on-year growth. Companies like NVIDIA, AMD, and Intel are increasing their investments.\"}",
    category: "硬件",
    readTime: Int32("3"),
    publishTime: ISODate("1970-01-01T04:13:25.329Z"),
    date: "2025-08-29",
    views: Int32("623"),
    comments: Int32("19"),
    isBreaking: false,
    isImportant: false,
    tags: "[\"AI芯片\",\"NVIDIA\",\"硬件\"]",
    locales: "{\"zh\":{\"title\":\"AI芯片市场预计2025年增长40%\",\"summary\":\"根据最新市场报告，全球AI芯片市场预计在2025年将达到650亿美元，同比增长40%。NVIDIA、AMD和英特尔等公司正在加大投资力度。\",\"tags\":[\"AI芯片\",\"NVIDIA\",\"硬件\"]},\"en\":{\"title\":\"AI Chip Market Expected to Grow 40% in 2025\",\"summary\":\"According to the latest market report, the global AI chip market is expected to reach $65 billion in 2025, with rapid year-on-year growth. Companies like NVIDIA, AMD, and Intel are increasing their investments.\",\"tags\":[]}}",
    updatedAt: ISODate("2025-08-31T05:23:37.78Z"),
    weekday: "Thursday"
} ]);
db.getCollection("news").insert([ {
    _id: "{\"$oid\":\"68b1b62cef317d108cc84e11\"}",
    semanticId: "ai-news-20250829-005",
    title: "{\"zh\":\"机器学习在气候预测中的新应用\",\"en\":\"New Applications of Machine Learning in Climate Prediction\"}",
    summary: "{\"zh\":\"科学家们利用深度学习技术开发了新的气候模型，能够更准确地预测极端天气事件。该模型在过去一年的测试中准确率达到89%。\",\"en\":\"Scientists have developed a new climate model using deep learning technology that can more accurately predict extreme weather events. The model achieved an accuracy rate of 89% during testing over the past year.\"}",
    category: "科学研究",
    readTime: Int32("6"),
    publishTime: ISODate("1970-01-01T00:13:25.329Z"),
    date: "2025-08-29",
    views: Int32("445"),
    comments: Int32("15"),
    isBreaking: false,
    isImportant: false,
    tags: "[]",
    locales: "{\"zh\":{\"title\":\"机器学习在气候预测中的新应用\",\"summary\":\"科学家们利用深度学习技术开发了新的气候模型，能够更准确地预测极端天气事件。该模型在过去一年的测试中准确率达到89%。\",\"tags\":[]},\"en\":{\"title\":\"New Applications of Machine Learning in Climate Prediction\",\"summary\":\"Scientists have developed a new climate model using deep learning technology that can more accurately predict extreme weather events. The model achieved an accuracy rate of 89% during testing over the past year.\",\"tags\":[]}}",
    updatedAt: ISODate("2025-08-31T05:23:37.78Z"),
    weekday: "Thursday"
} ]);
db.getCollection("news").insert([ {
    _id: ObjectId("68b46c18bebcdf7ee30ced7f"),
    title: {
        zh: "测试新闻标题",
        en: "Test News Title"
    },
    content: "这是一篇测试新闻的内容，包含详细的信息和描述。",
    summary: {
        zh: "这是新闻的简短介绍",
        en: "This is a brief introduction of the news"
    },
    category: "测试分类",
    tags: [
        "测试",
        "新闻"
    ],
    status: "published",
    author: "管理员",
    featured: true,
    imageUrl: "https://example.com/image.jpg",
    slug: "测试新闻标题",
    views: Int32("0"),
    comments: Int32("0"),
    createdAt: ISODate("2025-08-31T15:36:56.867Z"),
    updatedAt: ISODate("2025-08-31T15:36:56.867Z")
} ]);
db.getCollection("news").insert([ {
    _id: ObjectId("68b46ed3bebcdf7ee30ced82"),
    title: {
        zh: "测试新闻标题",
        en: "Test News Title"
    },
    content: "这是一篇测试新闻内容，用于验证新闻创建功能是否正常工作。",
    summary: {
        zh: "测试新闻摘要",
        en: "Test news summary"
    },
    category: "测试",
    tags: [
        "测试",
        "新闻"
    ],
    status: "published",
    author: "管理员",
    featured: false,
    imageUrl: "",
    slug: "测试新闻标题",
    semanticId: "ai-news-20250831-测试新闻标题-mezv7wd23o67",
    views: Int32("0"),
    comments: Int32("0"),
    createdAt: ISODate("2025-08-31T15:48:35.606Z"),
    updatedAt: ISODate("2025-08-31T15:48:35.606Z")
} ]);
db.getCollection("news").insert([ {
    _id: ObjectId("68b50fd9ef55b2ca0520d916"),
    title: {
        zh: "测试1",
        en: "test1"
    },
    content: "test1test1test1test1test1",
    summary: {
        zh: "测试1",
        en: "test1"
    },
    category: "大语言模型 (LLM)​",
    tags: [
        "ai"
    ],
    status: "draft",
    author: "unknown",
    featured: false,
    imageUrl: "",
    slug: "测试1",
    semanticId: "ai-news-20250901-测试1-mf0jrf7c95ck",
    views: Int32("0"),
    comments: Int32("0"),
    createdAt: ISODate("2025-09-01T03:15:37.272Z"),
    updatedAt: ISODate("2025-09-01T03:15:37.272Z")
} ]);
