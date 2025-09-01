import { MongoClient } from 'mongodb';

// MongoDB连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news';
const DB_NAME = 'ai-news';
const COLLECTION_NAME = 'articles';

// 示例文章数据 - 包含优化后的字段映射
const sampleArticles = [
  {
    semanticId: 'article-2024-ai-trends',
    title: {
      zh: '2024年人工智能发展趋势',
      en: 'AI Trends in 2024'
    },
    summary: {
      zh: '本文探讨2024年人工智能领域的最新发展趋势...',
      en: 'This article explores the latest AI trends in 2024...'
    },
    content: {
      zh: '<h2>2024年人工智能发展趋势</h2><p>随着技术的快速发展...</p>',
      en: '<h2>AI Trends in 2024</h2><p>With rapid technological development...</p>'
    },
    category: '67890abcde12345f67890ab', // 分类ObjectId
    author: 'abcdef1234567890abcdef12',  // 作者ObjectId
    views: 1250,
    imageUrl: '/images/ai-trends-2024.jpg',
    slug: '2024-ai-trends',
    publishedAt: new Date('2024-01-15T10:30:00Z'),
    tags: ['12345abcde67890f12345ab'],   // 标签ObjectId数组
    status: 'published',
    createdAt: new Date('2024-01-10T08:00:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    semanticId: 'article-multimodal-ai',
    title: {
      zh: '多模态AI技术突破',
      en: 'Multimodal AI Technology Breakthrough'
    },
    summary: {
      zh: '多模态AI在视觉和语言理解方面取得重大进展...',
      en: 'Multimodal AI has made significant progress in vision and language understanding...'
    },
    content: {
      zh: '<h2>多模态AI技术突破</h2><p>最新的多模态模型能够...</p><iframe src="https://www.youtube.com/embed/example" width="560" height="315"></iframe>',
      en: '<h2>Multimodal AI Technology Breakthrough</h2><p>The latest multimodal models can...</p><iframe src="https://www.youtube.com/embed/example" width="560" height="315"></iframe>'
    },
    category: '78901bcdef23456g78901bc',
    author: 'bcdef1234567890abcdef13',
    views: 890,
    imageUrl: '/images/multimodal-ai.jpg',
    slug: 'multimodal-ai-breakthrough',
    publishedAt: new Date('2024-02-20T14:15:00Z'),
    tags: ['23456bcdef78901g23456bc', '34567cdefg89012h34567cd'],
    status: 'published',
    createdAt: new Date('2024-02-15T09:30:00Z'),
    updatedAt: new Date('2024-02-20T14:15:00Z')
  }
];

async function importArticles() {
  let client;
  
  try {
    console.log('正在连接到MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    console.log('正在清空现有文章数据...');
    await collection.deleteMany({});
    
    console.log('正在导入优化后的文章数据...');
    const result = await collection.insertMany(sampleArticles);
    
    console.log(`✅ 成功导入 ${result.insertedCount} 篇文章`);
    console.log('\n📋 导入的文章字段结构：');
    console.log('- semanticId: 语义ID');
    console.log('- title: 标题（中英文）');
    console.log('- summary: 摘要（中英文）');
    console.log('- content: 内容（中英文，支持富文本HTML）');
    console.log('- category: 分类ObjectId');
    console.log('- author: 作者ObjectId');
    console.log('- views: 浏览量');
    console.log('- imageUrl: 图片URL');
    console.log('- slug: URL友好标识');
    console.log('- publishedAt: 发布时间');
    console.log('- tags: 标签ObjectId数组');
    console.log('- status: 状态（draft/published/archived）');
    console.log('- createdAt: 创建时间');
    console.log('- updatedAt: 更新时间');
    
    console.log('\n🎯 富文本内容支持：');
    console.log('• HTML格式内容存储');
    console.log('• YouTube视频嵌入');
    console.log('• 自定义iframe支持');
    console.log('• 代码高亮显示');
    console.log('• 多媒体内容');
    
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔗 MongoDB连接已关闭');
    }
  }
}

// 导出为JSON文件（用于MongoDB Compass直接导入）
function exportToJSON() {
  const fs = require('fs');
  const exportData = {
    database: DB_NAME,
    collection: COLLECTION_NAME,
    documents: sampleArticles
  };
  
  fs.writeFileSync('articles_optimized_import.json', JSON.stringify(exportData, null, 2));
  console.log('✅ 已生成 articles_optimized_import.json 文件');
  console.log('📁 使用方法：');
  console.log('1. 打开MongoDB Compass');
  console.log('2. 选择目标数据库: ' + DB_NAME);
  console.log('3. 选择集合: ' + COLLECTION_NAME);
  console.log('4. 点击"Import Data"');
  console.log('5. 选择生成的JSON文件');
  console.log('6. 确认导入选项并执行');
}

// 执行导入
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 生成MongoDB Compass导入脚本\n');
  
  // 生成JSON导入文件
  exportToJSON();
  
  console.log('\n📝 脚本使用方法：');
  console.log('1. 直接导入: node import_articles_optimized.js');
  console.log('2. 或使用MongoDB Compass导入生成的JSON文件');
  console.log('\n💡 提示：确保MongoDB服务正在运行');
}

export { importArticles, exportToJSON, sampleArticles };