import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  // 多语言名称
  name: {
    ch: { type: String, required: true }, // 中文名称（必需）
    en: { type: String }                  // 英文名称（可选）
  },
  
  // 标准化值（用于程序处理和URL）
  value: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // 多语言描述
  description: {
    ch: { type: String }, // 中文描述
    en: { type: String }   // 英文描述
  },
  
  // 显示顺序
  displayOrder: { type: Number, default: 0 },
  
  // 激活状态
  isActive: { type: Boolean, default: true },
  
  // 创建和更新时间
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 自动更新updatedAt时间戳
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 索引优化
  CategorySchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.model('Category', CategorySchema);