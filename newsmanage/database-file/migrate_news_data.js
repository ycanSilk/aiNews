/*
 * 新闻数据迁移脚本
 * 将现有 news 集合的数据转换为优化格式
 * 运行方式: mongosh "mongodb://localhost:27017/ai-news" migrate_news_data.js
 */

print("开始迁移新闻数据...");

// 1. 首先备份当前数据
print("1. 创建数据备份...");
const backupResult = db.news.aggregate([{ $out: "news_backup_" + new Date().toISOString().replace(/[:.]/g, "-") }]);
print("数据备份完成");

// 2. 统一标题字段格式
print("2. 统一标题字段格式...");
const titleUpdateResult = db.news.updateMany(
    { 
        $or: [
            { "title": { $type: "string" } },
            { "title": { $type: "binData" } },
            { "title": { $exists: false } }
        ]
    },
    [
        {
            $set: {
                title: {
                    zh: {
                        $cond: {
                            if: { $eq: [{ $type: "$title" }, "string"] },
                            then: "$title",
                            else: ""
                        }
                    },
                    en: ""
                }
            }
        }
    ]
);
print(`标题字段更新: ${titleUpdateResult.modifiedCount} 个文档`);

// 3. 统一摘要字段格式
print("3. 统一摘要字段格式...");
const summaryUpdateResult = db.news.updateMany(
    { 
        $or: [
            { "summary": { $type: "string" } },
            { "summary": { $type: "binData" } },
            { "summary": { $exists: false } }
        ]
    },
    [
        {
            $set: {
                summary: {
                    zh: {
                        $cond: {
                            if: { $eq: [{ $type: "$summary" }, "string"] },
                            then: "$summary",
                            else: ""
                        }
                    },
                    en: ""
                }
            }
        }
    ]
);
print(`摘要字段更新: ${summaryUpdateResult.modifiedCount} 个文档`);

// 4. 合并视图计数字段
print("4. 合并视图计数字段...");
const viewsUpdateResult = db.news.updateMany(
    { 
        "views": { $exists: false },
        "viewCount": { $exists: true }
    },
    [
        {
            $set: {
                views: "$viewCount"
            }
        },
        {
            $unset: "viewCount"
        }
    ]
);
print(`视图字段合并: ${viewsUpdateResult.modifiedCount} 个文档`);

// 5. 处理发布时间字段
print("5. 处理发布时间字段...");
const publishTimeUpdateResult = db.news.updateMany(
    { 
        "publishedAt": { $exists: false },
        "publishTime": { $exists: true }
    },
    [
        {
            $set: {
                publishedAt: "$publishTime"
            }
        },
        {
            $unset: "publishTime"
        }
    ]
);
print(`发布时间字段处理: ${publishTimeUpdateResult.modifiedCount} 个文档`);

// 6. 标准化分类值
print("6. 标准化分类值...");
const categoryMappings = {
    "大语言模型": "large-language-models",
    "医疗AI": "medical-ai", 
    "自动驾驶": "autonomous-driving",
    "硬件": "hardware",
    "科学研究": "scientific-research",
    "测试": "test",
    "测试分类": "test"
};

let totalCategoryUpdates = 0;
for (const [oldCategory, newCategory] of Object.entries(categoryMappings)) {
    const categoryUpdateResult = db.news.updateMany(
        { category: oldCategory },
        { $set: { category: newCategory } }
    );
    totalCategoryUpdates += categoryUpdateResult.modifiedCount;
    print(`分类 ${oldCategory} -> ${newCategory}: ${categoryUpdateResult.modifiedCount} 个文档`);
}

// 7. 清理不必要的字段
print("7. 清理不必要的字段...");
const cleanupResult = db.news.updateMany(
    {},
    {
        $unset: {
            date: "",
            weekday: "",
            locales: "",
            isHot: "",
            isRecommended: ""
        }
    }
);
print(`字段清理完成: ${cleanupResult.modifiedCount} 个文档`);

// 8. 确保必需字段存在
print("8. 确保必需字段存在...");
const ensureRequiredFieldsResult = db.news.updateMany(
    {
        $or: [
            { views: { $exists: false } },
            { comments: { $exists: false } },
            { status: { $exists: false } },
            { createdAt: { $exists: false } },
            { updatedAt: { $exists: false } }
        ]
    },
    [
        {
            $set: {
                views: { $ifNull: ["$views", 0] },
                comments: { $ifNull: ["$comments", 0] },
                status: { $ifNull: ["$status", "draft"] },
                createdAt: { $ifNull: ["$createdAt", new Date()] },
                updatedAt: { $ifNull: ["$updatedAt", new Date()] }
            }
        }
    ]
);
print(`必需字段确保完成: ${ensureRequiredFieldsResult.modifiedCount} 个文档`);

// 9. 验证迁移结果
print("9. 验证迁移结果...");
const totalDocs = db.news.countDocuments();
const docsWithIssues = db.news.find({
    $or: [
        { title: { $type: "string" } },
        { summary: { $type: "string" } },
        { viewCount: { $exists: true } },
        { publishTime: { $exists: true } },
        { date: { $exists: true } },
        { weekday: { $exists: true } },
        { locales: { $exists: true } }
    ]
}).count();

const validDocs = totalDocs - docsWithIssues;

print("\n迁移结果统计:");
print(`总文档数: ${totalDocs}`);
print(`有效文档数: ${validDocs}`);
print(`存在问题文档数: ${docsWithIssues}`);

if (docsWithIssues > 0) {
    print("\n警告: 发现一些文档仍存在问题，建议手动检查:");
    const problemDocs = db.news.find({
        $or: [
            { title: { $type: "string" } },
            { summary: { $type: "string" } },
            { viewCount: { $exists: true } },
            { publishTime: { $exists: true } }
        ]
    }, { _id: 1, title: 1 }).limit(5);
    
    print("示例问题文档:");
    problemDocs.forEach(doc => {
        print(`  - ${doc._id}: ${JSON.stringify(doc.title)}`);
    });
}

// 10. 创建验证报告
print("\n10. 生成详细验证报告...");
const validationReport = {
    timestamp: new Date(),
    totalDocuments: totalDocs,
    validDocuments: validDocs,
    documentsWithIssues: docsWithIssues,
    fieldStatistics: {
        title: {
            objectFormat: db.news.countDocuments({ title: { $type: "object" } }),
            stringFormat: db.news.countDocuments({ title: { $type: "string" } }),
            missing: db.news.countDocuments({ title: { $exists: false } })
        },
        summary: {
            objectFormat: db.news.countDocuments({ summary: { $type: "object" } }),
            stringFormat: db.news.countDocuments({ summary: { $type: "string" } }),
            missing: db.news.countDocuments({ summary: { $exists: false } })
        },
        views: {
            exists: db.news.countDocuments({ views: { $exists: true } }),
            missing: db.news.countDocuments({ views: { $exists: false } })
        },
        category: {
            standardized: db.news.countDocuments({ 
                category: { 
                    $in: Object.values(categoryMappings) 
                } 
            }),
            nonStandardized: db.news.countDocuments({ 
                category: { 
                    $nin: Object.values(categoryMappings) 
                } 
            })
        }
    }
};

print("\n详细统计报告:");
print(JSON.stringify(validationReport, null, 2));

// 保存报告到文件
const reportCollection = "news_migration_report_" + new Date().toISOString().replace(/[:.]/g, "-");
db[reportCollection].insertOne(validationReport);

print("\n迁移完成!");
print("建议:");
print("1. 在应用程序中测试新的数据结构");
print("2. 监控应用程序日志是否有错误");
print("3. 如果发现问题，可以使用备份数据进行恢复");
print("4. 确认无误后，可以删除备份数据以节省空间");

print("\n备份集合名称: " + Object.keys(backupResult)[0]);
print("报告集合名称: " + reportCollection);