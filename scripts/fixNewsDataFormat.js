import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from '../src/models/News.js';

dotenv.config();

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 连接状态监听
mongoose.connection.on('connected', async () => {
  console.log('Connected to MongoDB');
  
  try {
    const News = mongoose.model('News');
    
    // 获取所有新闻数据
    const allNews = await News.find({});
    
    console.log(`Found ${allNews.length} news items to process`);
    
    let updatedCount = 0;
    
    for (const newsItem of allNews) {
      let needsUpdate = false;
      
      // 检查title字段是否是字符串（JSON格式）
      if (typeof newsItem.title === 'string') {
        try {
          const parsedTitle = JSON.parse(newsItem.title);
          newsItem.title = parsedTitle;
          needsUpdate = true;
        } catch (error) {
          console.error(`Failed to parse title for news ${newsItem._id}:`, error);
        }
      }
      
      // 检查summary字段是否是字符串（JSON格式）
      if (typeof newsItem.summary === 'string') {
        try {
          const parsedSummary = JSON.parse(newsItem.summary);
          newsItem.summary = parsedSummary;
          needsUpdate = true;
        } catch (error) {
          console.error(`Failed to parse summary for news ${newsItem._id}:`, error);
        }
      }
      
      // 检查tags字段是否是字符串数组
      if (newsItem.tags && newsItem.tags.length > 0 && typeof newsItem.tags[0] === 'string') {
        try {
          // 尝试解析每个tag（可能包含JSON数组字符串）
          newsItem.tags = newsItem.tags.map(tag => {
            if (tag.startsWith('[') && tag.endsWith(']')) {
              try {
                return JSON.parse(tag);
              } catch {
                return tag;
              }
            }
            return tag;
          }).flat();
          needsUpdate = true;
        } catch (error) {
          console.error(`Failed to process tags for news ${newsItem._id}:`, error);
        }
      }
      
      if (needsUpdate) {
        await newsItem.save();
        updatedCount++;
        console.log(`Updated news item: ${newsItem._id}`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} news items.`);
    process.exit(0);
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});