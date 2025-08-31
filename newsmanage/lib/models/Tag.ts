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
  
  // 标签颜色（用于UI显示）
  color: { type: String, default: '#3B82F6' },
  
  // 激活状态
  isActive: { type: Boolean, default: true },
  
  // 文章数量
  articleCount: { type: Number, default: 0 },
  
  // 创建和更新时间
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 自动更新updatedAt时间戳
TagSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 索引优化
TagSchema.index({ isActive: 1 });
TagSchema.index({ value: 1 });

// 导出模型 - 使用明确的模型定义避免类型冲突
const TagModel = mongoose.models.Tag || mongoose.model('Tag', TagSchema, 'tags');
export default TagModel;