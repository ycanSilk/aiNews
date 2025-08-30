import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  password: string
  role: 'admin' | 'editor' | 'viewer'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// 创建索引
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

// 防止重复模型定义
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)