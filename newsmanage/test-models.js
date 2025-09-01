import mongoose from 'mongoose';
import Article from './lib/models/Article.ts';
import Category from './lib/models/Category.ts';
import Tag from './lib/models/Tag.ts';
import User from './lib/models/User.ts';

// 连接数据库
mongoose.connect('mongodb://localhost:27017/ai-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testModels() {
  try {
    console.log('Testing model registration...');
    
    // 检查模型是否已注册
    console.log('Article model:', mongoose.models.Article ? 'Registered' : 'Not registered');
    console.log('Category model:', mongoose.models.Category ? 'Registered' : 'Not registered');
    console.log('Tag model:', mongoose.models.Tag ? 'Registered' : 'Not registered');
    console.log('User model:', mongoose.models.User ? 'Registered' : 'Not registered');
    
    // 尝试查询
    const categories = await Category.find({});
    console.log('Categories found:', categories.length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

testModels();