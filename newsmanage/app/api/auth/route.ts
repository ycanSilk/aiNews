import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export async function POST(request: NextRequest) {
  try {
    console.log('🔌 数据库连接中...')
    await connectDB()
    console.log('✅ 数据库连接成功')
    
    const { username, password } = await request.json()
    
    if (!username || !password) {
      console.log('❌ 输入验证失败: 用户名或密码为空')
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }
    
    console.log('🔍 查找用户:', username)
    // 查找用户 - 使用User模型
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }],
      isActive: true 
    })
    
    if (!user) {
      console.log('❌ 用户不存在:', username)
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }
    
    console.log('✅ 用户找到:', user.username)
    
    if (!user.isActive) {
      console.log('❌ 账户已被禁用:', username)
      return NextResponse.json(
        { success: false, error: '账户已被禁用' },
        { status: 401 }
      )
    }
    
    console.log('🔐 验证密码中...')
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      console.log('❌ 密码验证失败:', username)
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      )
    }
    
    console.log('✅ 密码验证成功:', username)
    
    // 更新最后登录时间
    console.log('⏰ 更新最后登录时间')
    await User.findByIdAndUpdate(
      user._id,
      { $set: { lastLogin: new Date() } }
    )
    
    // 生成JWT token
    console.log('🔑 生成JWT token')
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )
    
    // 返回用户信息（排除密码）
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin
    }
    
    console.log('✅ 登录成功:', username)
    return NextResponse.json({
      success: true,
      data: {
        user: userResponse,
        token: token
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}