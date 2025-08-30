import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  // 多语言名称
  name: {
    zh: { type: String, required: true }, // 中文名称（必需）
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
    zh: { type: String }, // 中文描述
    en: { type: String }   // 英文描述
  },
  
  // 激活状态
  isActive: { type: Boolean, default: true },
  
  // 创建和更新时间
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 自动更新updatedAt时间戳
TagSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// 索引优化
  TagSchema.index({ isActive: 1 });

export default mongoose.model('Tag', TagSchema);