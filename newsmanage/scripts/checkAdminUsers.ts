import mongoose from 'mongoose'
import connectDB from '@/lib/database/mongodb'
import User from '@/lib/models/User'

async function checkAdminUsers() {
  try {
    console.log('🔌 连接数据库中...')
    await connectDB()
    console.log('✅ 数据库连接成功')
    
    // 查询所有管理员用户
    const users = await User.find({})
    
    console.log(`📊 找到 ${users.length} 个管理员用户:`)
    
    if (users.length === 0) {
      console.log('❌ 没有找到任何管理员用户')
      return
    }
    
    users.forEach((user, index) => {
      console.log(`\n--- 用户 ${index + 1} ---`)
      console.log(`ID: ${user._id}`)
      console.log(`用户名: ${user.username}`)
      console.log(`邮箱: ${user.email || '未设置'}`)
      console.log(`角色: ${user.role}`)
      console.log(`状态: ${user.isActive ? '激活' : '禁用'}`)
      console.log(`创建时间: ${user.createdAt}`)
      console.log(`最后登录: ${user.lastLogin || '从未登录'}`)
    })
    
    // 检查是否存在admin用户
    const adminUser = users.find(u => u.username === 'admin')
    
    if (adminUser) {
      console.log('\n✅ 找到admin用户:')
      console.log(`用户名: ${adminUser.username}`)
      console.log(`状态: ${adminUser.isActive ? '激活' : '禁用'}`)
    } else {
      console.log('\n❌ 没有找到admin用户')
    }
    
  } catch (error) {
    console.error('❌ 查询错误:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n🔌 数据库连接已关闭')
  }
}

// 执行查询
checkAdminUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('脚本执行错误:', error)
    process.exit(1)
  })