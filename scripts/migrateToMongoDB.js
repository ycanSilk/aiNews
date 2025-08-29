import mongoose from 'mongoose';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

// 连接MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-news');

import News from '../src/models/News.js';

// 将相对时间转换为Date对象
function convertRelativeTimeToDate(relativeTime, dateStr) {
  if (!relativeTime || !dateStr) return new Date();
  
  // 如果已经是ISO格式，直接返回
  if (relativeTime.includes('T') && relativeTime.includes('Z')) {
    return new Date(relativeTime);
  }
  
  const now = new Date();
  const baseDate = new Date(dateStr);
  
  // 处理相对时间描述
  if (relativeTime.includes('小时前')) {
    const hours = parseInt(relativeTime);
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  } else if (relativeTime.includes('天前')) {
    const days = parseInt(relativeTime);
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  } else if (relativeTime.includes('分钟前')) {
    const minutes = parseInt(relativeTime);
    return new Date(now.getTime() - minutes * 60 * 1000);
  }
  
  // 默认返回基于日期的中午时间
  baseDate.setHours(12, 0, 0, 0);
  return baseDate;
}

async function migrateData() {
  try {
    // 读取现有的JSON数据
    const zhNewsData = JSON.parse(await fs.readFile('./src/data/content/news/articles/cn/newsData.json', 'utf8'));
    const enNewsData = JSON.parse(await fs.readFile('./src/data/content/news/articles/en/newsData.json', 'utf8'));
    const masterData = JSON.parse(await fs.readFile('./src/data/newsMasterData.json', 'utf8'));

    console.log('开始数据迁移...');
    console.log(`中文数据: ${zhNewsData.length} 条`);
    console.log(`英文数据: ${enNewsData.length} 条`);
    console.log(`主数据: ${masterData.news.length} 条`);

    // 清空现有数据
    await News.deleteMany({});
    console.log('已清空现有数据库记录');

    // 迁移数据
    let successCount = 0;
    let errorCount = 0;

    for (const item of masterData.news) {
      try {
        const zhItem = zhNewsData.find(n => n.id === item.id);
        const enItem = enNewsData.find(n => n.id === item.id);

        const newsDoc = new News({
          semanticId: item.semanticId,
          title: {
            zh: zhItem?.title,
            en: enItem?.title
          },
          summary: {
            zh: zhItem?.summary,
            en: enItem?.summary
          },
          category: zhItem?.category,
          readTime: zhItem?.readTime,
          publishTime: convertRelativeTimeToDate(zhItem?.publishTime, zhItem?.date),
          date: zhItem?.date,
          weekday: zhItem?.weekday,
          views: zhItem?.views || 0,
          comments: zhItem?.comments || 0,
          tags: zhItem?.tags || [],
          locales: item.locales || {}
        });

        await newsDoc.save();
        successCount++;

        if (successCount % 10 === 0) {
          console.log(`已迁移 ${successCount} 条数据...`);
        }
      } catch (error) {
        console.error(`迁移数据 ID ${item.id} 时出错:`, error.message);
        errorCount++;
      }
    }

    console.log('数据迁移完成！');
    console.log(`成功: ${successCount} 条`);
    console.log(`失败: ${errorCount} 条`);
    
    process.exit(0);
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

// 如果是直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export { migrateData };