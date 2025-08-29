import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置路径
const config = {
  masterDataPath: path.join(__dirname, '../src/data/newsMasterData.json'),
  oldDataPaths: {
    ch: path.join(__dirname, '../src/data/content/news/articles/cn/newsData.json'),
    en: path.join(__dirname, '../src/data/content/news/articles/en/newsData.json')
  },
  semanticConfigPath: path.join(__dirname, '../src/data/config/semanticIdConfig.json')
};

// 读取JSON文件
function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// 写入JSON文件
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error.message);
  }
}

// 生成语义化ID
function generateSemanticId(newsItem, index) {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  // 从标题中提取关键信息
  const title = newsItem.title || '';
  let company = '';
  let product = '';
  
  // 简单的关键词匹配
  if (title.toLowerCase().includes('openai') || title.toLowerCase().includes('gpt')) {
    company = 'openai';
    product = title.toLowerCase().includes('gpt') ? 'gpt' : 'ai';
  } else if (title.toLowerCase().includes('google') || title.toLowerCase().includes('gemini')) {
    company = 'google';
    product = title.toLowerCase().includes('gemini') ? 'gemini' : 'ai';
  } else if (title.toLowerCase().includes('microsoft') || title.toLowerCase().includes('copilot')) {
    company = 'microsoft';
    product = title.toLowerCase().includes('copilot') ? 'copilot' : 'ai';
  } else if (title.toLowerCase().includes('nvidia')) {
    company = 'nvidia';
    product = 'gpu';
  } else {
    // 默认使用ai作为领域
    company = 'ai';
    product = 'news';
  }
  
  return `${company}-${product}-${dateStr}-${String(index).padStart(3, '0')}`;
}

// 迁移数据到主数据格式
function migrateData() {
  console.log('Starting data migration...');
  console.log('Reading Chinese data from:', config.oldDataPaths.ch);
  
  // 读取中文数据作为基础数据
  const oldData = readJSON(config.oldDataPaths.ch);
  if (!oldData) {
    console.error('No old data found to migrate');
    return;
  }
  
  console.log(`Found ${oldData.length} Chinese news items`);
  console.log('Reading English data from:', config.oldDataPaths.en);
  
  // 读取中文数据
  const chData = readJSON(config.oldDataPaths.ch);
  const enData = readJSON(config.oldDataPaths.en);
  
  // 创建主数据结构
  const masterData = {
    version: "1.0",
    lastUpdated: new Date().toISOString(),
    news: []
  };
  
  // 迁移每条新闻
  oldData.forEach((newsItem, index) => {
    const semanticId = generateSemanticId(newsItem, index + 1);
    
    // 查找对应语言版本的数据
    const chItem = chData ? chData.find(item => item.id === newsItem.id) : null;
    const enItem = enData ? enData.find(item => item.id === newsItem.id) : null;
    
    const migratedItem = {
      id: newsItem.id,
      semanticId: semanticId,
      category: newsItem.category || '',
      source: newsItem.source || '',
      author: newsItem.author || '',
      publishTime: newsItem.publishTime || '',
      isBreaking: newsItem.isBreaking || false,
      isImportant: newsItem.isImportant || false,
      views: newsItem.views || 0,
      comments: newsItem.comments || 0,
      locales: {
        zh: {
          title: chItem ? chItem.title : newsItem.title,
          summary: chItem ? chItem.summary : newsItem.summary,
          tags: chItem ? chItem.tags : newsItem.tags
        },
        en: {
          title: enItem ? enItem.title : newsItem.title,
          summary: enItem ? enItem.summary : newsItem.summary,
          tags: enItem ? enItem.tags : newsItem.tags
        }
      }
    };
    
    masterData.news.push(migratedItem);
  });
  
  // 写入主数据文件
  writeJSON(config.masterDataPath, masterData);
  
  console.log(`Migration completed. ${masterData.news.length} news items migrated.`);
  console.log('Master data file created at:', config.masterDataPath);
}

// 执行迁移
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData, generateSemanticId };