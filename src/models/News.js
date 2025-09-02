import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  // 核心标识字段
  semanticId: { type: String, required: true, unique: true },
  
  // 多语言内容
  title: {
    ch: { type: String, required: true },
    en: { type: String }
  },
  summary: {
    ch: { type: String },
    en: { type: String }
  },
  content: {
    ch: { type: String, required: true },
    en: { type: String }
  },
  
  // 分类和标签引用
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  tags: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag' 
  }],
  
  // 展示控制字段
  isHot: { type: Boolean, default: false },      // 热门标记
  isRecommended: { type: Boolean, default: false }, // 推荐标记
  displayOrder: { type: Number, default: 0 },    // 显示顺序
  isPublished: { type: Boolean, default: true }, // 发布状态
  
  // 媒体资源
  coverImage: { type: String },                   // 封面图片
  images: [{ type: String }],                     // 内容图片
  
  // 时间统计
  publishTime: { type: Date, default: Date.now }, // 发布时间
  createdAt: { type: Date, default: Date.now },   // 创建时间
  updatedAt: { type: Date, default: Date.now },   // 更新时间
  
  // 浏览量统计
  viewCount: { type: Number, default: 0 }         // 浏览量
});

// 自动更新updatedAt时间戳
NewsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // 自动热门标记逻辑：浏览量超过1000自动标记为热门
  if (this.viewCount > 1000 && !this.isHot) {
    this.isHot = true;
  } else if (this.viewCount <= 1000 && this.isHot) {
    this.isHot = false;
  }
  
  next();
});

// 索引优化
NewsSchema.index({ category: 1 });
NewsSchema.index({ isPublished: 1, publishTime: -1 });
NewsSchema.index({ isHot: 1, publishTime: -1 });
NewsSchema.index({ isRecommended: 1, publishTime: -1 });
NewsSchema.index({ viewCount: -1 });

export default mongoose.model('News', NewsSchema);