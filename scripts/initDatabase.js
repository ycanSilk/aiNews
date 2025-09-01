import mongoose from 'mongoose';
import Category from '../newsmanage/lib/models/Category.js';
import Tag from '../newsmanage/lib/models/Tag.js';
import News from '../newsmanage/lib/models/News.js';
import Article from '../newsmanage/lib/models/Article.js';
import User from '../newsmanage/lib/models/User.js';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 示例数据
const sampleCategories = [
  {
    name: { zh: '科技', en: 'Technology' },
    value: 'technology',
    description: { zh: '科技类新闻和文章', en: 'Technology news and articles' },
    displayOrder: 1,
    isActive: true
  },
  {
    name: { zh: '财经', en: 'Finance' },
    value: 'finance',
    description: { zh: '财经类新闻和文章', en: 'Finance news and articles' },
    displayOrder: 2,
    isActive: true
  },
  {
    name: { zh: '体育', en: 'Sports' },
    value: 'sports',
    description: { zh: '体育类新闻和文章', en: 'Sports news and articles' },
    displayOrder: 3,
    isActive: true
  }
];

const sampleTags = [
  {
    name: { zh: '人工智能', en: 'Artificial Intelligence' },
    value: 'ai',
    description: { zh: '人工智能相关话题', en: 'Artificial Intelligence topics' },
    isActive: true
  },
  {
    name: { zh: '区块链', en: 'Blockchain' },
    value: 'blockchain',
    description: { zh: '区块链技术相关', en: 'Blockchain technology' },
    isActive: true
  },
  {
    name: { zh: '投资', en: 'Investment' },
    value: 'investment',
    description: { zh: '投资理财相关', en: 'Investment and finance' },
    isActive: true
  }
];

async function initDatabase() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aiNews');
    console.log('Connected to MongoDB');

    // 删除现有集合
    console.log('Dropping existing collections...');
    await mongoose.connection.db.dropCollection('categories');
    await mongoose.connection.db.dropCollection('tags');
    await mongoose.connection.db.dropCollection('news');
    await mongoose.connection.db.dropCollection('articles');
    await mongoose.connection.db.dropCollection('users');
    console.log('Collections dropped successfully');

    // 创建索引
    console.log('Creating indexes...');
    
    // 删除所有现有索引
    await mongoose.connection.db.collection('categories').dropIndexes();
    await mongoose.connection.db.collection('tags').dropIndexes();
    await mongoose.connection.db.collection('news').dropIndexes();
    await mongoose.connection.db.collection('articles').dropIndexes();
    await mongoose.connection.db.collection('users').dropIndexes();
    console.log('Existing indexes dropped');
    
    // 重新创建索引
    await Category.init();
    await Tag.init();
    await News.init();
    await Article.init();
    await User.init();
    console.log('Indexes created successfully');

    // 插入示例数据
    console.log('Inserting sample data...');
    const categories = await Category.insertMany(sampleCategories);
    const tags = await Tag.insertMany(sampleTags);
    console.log('Sample data inserted successfully');

    // 创建默认管理员用户
    console.log('Creating default admin user...');
    const adminUser = new User({
      username: 'admin',
      password: 'admin123', // 默认密码，建议首次登录后修改
      email: 'admin@ainews.com',
      role: 'admin',
      isActive: true
    });
    await adminUser.save();
    console.log('Default admin user created successfully');

    console.log('Database initialization completed!');
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${tags.length} tags`);
    console.log('Created default admin user: admin / admin123');

  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// 执行初始化
initDatabase();