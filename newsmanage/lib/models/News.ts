import mongoose, { Document, Schema } from 'mongoose'

export interface INews extends Document {
  semanticId: string
  title: {
    zh: string
    en: string
  }
  summary: {
    zh: string
    en: string
  }
  content: {
    zh: string
    en: string
  }
  category: string
  tags: string[]
  author: mongoose.Types.ObjectId
  status: 'draft' | 'published' | 'archived'
  publishedAt?: Date
  views: number
  readTime: number
  imageUrl?: string
  slug: string
  isHot: boolean
  isImportant: boolean
  isCritical: boolean
  externalUrl?: string
  createdAt: Date
  updatedAt: Date
}

const NewsSchema: Schema = new Schema({
  semanticId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    zh: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    }
  },
  summary: {
    zh: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    en: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    }
  },
  content: {
    zh: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
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
  readTime: {
    type: Number,
    default: 5
  },
  isHot: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  externalUrl: {
    type: String,
    trim: true
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
  timestamps: true,
  strict: false
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