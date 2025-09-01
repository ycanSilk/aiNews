import mongoose, { Document, Schema } from 'mongoose'

export interface IArticle extends Document {
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
  category: mongoose.Types.ObjectId
  tags: mongoose.Types.ObjectId[]
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
  featuredImage?: {
    url: string
    alt: string
    caption?: string
  }
  seo: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  relatedArticles: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const ArticleSchema: Schema = new Schema({
  semanticId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
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
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    index: true
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  publishedAt: {
    type: Date,
    index: true
  },
  views: {
    type: Number,
    default: 0,
    index: true
  },
  readTime: {
    type: Number,
    default: 5,
    min: 1,
    max: 60
  },
  imageUrl: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  isHot: {
    type: Boolean,
    default: false,
    index: true
  },
  isImportant: {
    type: Boolean,
    default: false,
    index: true
  },
  isCritical: {
    type: Boolean,
    default: false,
    index: true
  },
  externalUrl: {
    type: String,
    trim: true
  },
  featuredImage: {
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true,
      maxlength: 200
    },
    caption: {
      type: String,
      trim: true,
      maxlength: 300
    }
  },
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 200
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 300
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  relatedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
}, {
  timestamps: true,
  strict: false
})

// 全文搜索索引
ArticleSchema.index({ 
  'title.zh': 'text', 
  'title.en': 'text',
  'summary.zh': 'text', 
  'summary.en': 'text',
  'content.zh': 'text',
  'content.en': 'text'
})

// 复合索引
ArticleSchema.index({ status: 1, publishedAt: -1 })
ArticleSchema.index({ category: 1, status: 1 })
ArticleSchema.index({ author: 1, status: 1 })
ArticleSchema.index({ isHot: 1, publishedAt: -1 })
ArticleSchema.index({ isImportant: 1, publishedAt: -1 })

// 虚拟字段：格式化发布时间
ArticleSchema.virtual('formattedPublishTime').get(function() {
  if (!this.publishedAt) return ''
  return this.publishedAt.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 自动生成slug（如果未提供）
ArticleSchema.pre('save', function(next) {
  if (!this.slug && this.title.zh) {
    this.slug = this.title.zh
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  next()
})

// 自动设置阅读时间（基于内容长度）
ArticleSchema.pre('save', function(next) {
  if (this.isModified('content.zh') || this.isModified('content.en')) {
    const zhContent = this.content?.zh || ''
    const enContent = this.content?.en || ''
    const totalLength = zhContent.length + enContent.length
    // 假设阅读速度为每分钟500字
    this.readTime = Math.max(1, Math.ceil(totalLength / 500))
  }
  next()
})

// 防止重复模型定义
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema)