import mongoose from 'mongoose';

// 连接数据库
mongoose.connect('mongodb://localhost:27017/ai-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 手动注册模型（模拟导入）
const CategorySchema = new mongoose.Schema({
  name: {
    zh: String,
    en: String
  },
  normalizedValue: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  }
});

// 注册Category模型
const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

async function testSimple() {
  try {
    console.log('Testing simple model registration...');
    
    // 检查模型是否已注册
    console.log('Category model:', mongoose.models.Category ? 'Registered' : 'Not registered');
    
    // 尝试查询
    const categories = await Category.find({});
    console.log('Categories found:', categories.length);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    mongoose.connection.close();
  }
}

testSimple();