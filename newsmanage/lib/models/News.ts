import mongoose, { Document, Schema } from 'mongoose'

export interface INews extends Document {
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  views: number
  featured: boolean
  imageUrl?: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, {
  timestamps: true
})

// 创建索引
NewsSchema.index({ title: 'text', content: 'text', summary: 'text' })
NewsSchema.index({ category: 1 })
NewsSchema.index({ status: 1 })
NewsSchema.index({ publishedAt: 1 })
NewsSchema.index({ featured: 1 })
NewsSchema.index({ author: 1 })

// 防止重复模型定义
export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema)