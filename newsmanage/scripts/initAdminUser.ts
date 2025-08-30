import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/newsmanage'

async function initAdminUser() {
  try {
    await mongoose.connect(MONGODB_URI)
    
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
      createdAt: Date,
      updatedAt: Date
    }))
    
    // 检查是否已存在管理员用户
    const existingAdmin = await User.findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('管理员用户已存在')
      await mongoose.disconnect()
      return
    }
    
    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    
    await adminUser.save()
    
    console.log('管理员用户创建成功')
    console.log('用户名: admin')
    console.log('密码: admin123')
    
  } catch (error) {
    console.error('初始化管理员用户失败:', error)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

initAdminUser()