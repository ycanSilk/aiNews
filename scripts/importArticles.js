import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 定义Article模型
const ArticleSchema = new mongoose.Schema({
  semanticId: { type: String, required: true, unique: true },
  title: {
    zh: { type: String, required: true },
    en: { type: String, required: true }
  },
  author: {
    zh: { type: String, required: true },
    en: { type: String, required: true }
  },
  content: {
    zh: [{ type: String }],
    en: [{ type: String }]
  },
  highlight: {
    zh: { type: String },
    en: { type: String }
  },
  tags: [{ type: String }],
  publishDate: { type: Date, default: Date.now },
  coverImage: { type: String },
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  category: { type: String }
}, { timestamps: true });

const Article = mongoose.model('Article', ArticleSchema);

// 解析中文日期格式
const parseChineseDate = (dateStr) => {
  if (!dateStr) return null;
  
  // 匹配格式：2024年3月15日
  const match = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
  if (match) {
    const year = parseInt(match[1]);
    const month = parseInt(match[2]) - 1; // 月份从0开始
    const day = parseInt(match[3]);
    return new Date(year, month, day);
  }
  
  return null;
};

// 读取JSON文件
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

// 导入数据
const importArticles = async () => {
  try {
    // 读取中文文章数据
    const cnArticlesPath = path.join(__dirname, '..', 'src', 'data', 'local', 'cn', 'article.json');
    const cnData = readJSONFile(cnArticlesPath);
    
    // 读取英文文章数据
    const enArticlesPath = path.join(__dirname, '..', 'src', 'data', 'local', 'en', 'article.json');
    const enData = readJSONFile(enArticlesPath);
    
    if (!cnData || !enData) {
      throw new Error('Failed to read JSON files');
    }
    
    // 清空现有数据
    await Article.deleteMany({});
    
    // 合并中英文数据并导入
    const articlesToImport = [];
    
    for (let i = 0; i < cnData.articles.length; i++) {
      const cnArticle = cnData.articles[i];
      const enArticle = enData.articles[i];
      
      const article = new Article({
        semanticId: `article-${i + 1}`,
        title: {
          zh: cnArticle.title,
          en: enArticle.title
        },
        author: {
          zh: cnArticle.author,
          en: enArticle.author
        },
        content: {
          zh: cnArticle.content,
          en: enArticle.content
        },
        highlight: {
          zh: cnArticle.highlight,
          en: enArticle.highlight
        },
        tags: cnArticle.tags,
        publishDate: parseChineseDate(cnArticle.date) || new Date(),
        coverImage: cnArticle.coverImage,
        isFeatured: i < 2, // 前两篇文章设为精选
        category: 'AI新闻'
      });
      
      articlesToImport.push(article.save());
    }
    
    await Promise.all(articlesToImport);
    console.log(`Successfully imported ${articlesToImport.length} articles`);
    
  } catch (error) {
    console.error('Error importing articles:', error);
  } finally {
    mongoose.connection.close();
  }
};

// 运行导入
importArticles();