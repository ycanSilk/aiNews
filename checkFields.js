import mongoose from 'mongoose';

async function checkFields() {
  try {
    // 连接到MongoDB
    await mongoose.connect('mongodb://localhost:27017/ai-news');
    console.log('Connected to MongoDB');
    
    // 检查news集合中的字段
    const News = mongoose.model('News', new mongoose.Schema({}, { strict: false }));
    
    // 查找包含weekday、week或test字段的文档
    const docs = await News.find({
      $or: [
        { weekday: { $exists: true } },
        { week: { $exists: true } },
        { test: { $exists: true } }
      ]
    }).limit(5);
    
    console.log('Found documents with weekday/week/test fields:');
    docs.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log('  weekday:', doc.weekday);
      console.log('  week:', doc.week);
      console.log('  test:', doc.test);
      console.log('  _id:', doc._id);
    });
    
    // 统计字段存在情况
    const weekdayCount = await News.countDocuments({ weekday: { $exists: true } });
    const weekCount = await News.countDocuments({ week: { $exists: true } });
    const testCount = await News.countDocuments({ test: { $exists: true } });
    
    console.log('\nField statistics:');
    console.log('  Documents with weekday field:', weekdayCount);
    console.log('  Documents with week field:', weekCount);
    console.log('  Documents with test field:', testCount);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkFields();