import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await connectDB()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 500 }
      )
    }
    
    // 获取所有新闻数据，包含多语言字段
    const news = await db.collection('news').find({}).toArray()
    
    // 处理多语言字段显示
    const processedNews = news.map(item => {
      // 解析多语言字段，处理字符串格式
      const parseMultilingualField = (field: any) => {
        if (typeof field === 'object') {
          return field
        }
        if (typeof field === 'string') {
          try {
            return JSON.parse(field)
          } catch {
            // 如果解析失败，返回默认的多语言结构
            return { zh: field || '', en: field || '' }
          }
        }
        return { zh: '', en: '' }
      }
      
      return {
        ...item,
        title: parseMultilingualField(item.title),
        summary: parseMultilingualField(item.summary),
        locales: parseMultilingualField(item.locales),
        // 处理tags数组
        tags: Array.isArray(item.tags) ? item.tags : []
      }
    })
    
    return NextResponse.json({
      success: true,
      data: processedNews
    })
  } catch (error) {
    console.error('获取新闻列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取新闻列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, category, status } = body
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '标题和内容不能为空' },
        { status: 400 }
      )
    }
    
    await connectDB()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 500 }
      )
    }
    
    const newNews = {
      title,
      content,
      category: category || '未分类',
      status: status || 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection('news').insertOne(newNews)
    
    return NextResponse.json({
      success: true,
      data: { ...newNews, _id: result.insertedId }
    })
  } catch (error) {
    console.error('创建新闻失败:', error)
    return NextResponse.json(
      { success: false, error: '创建新闻失败' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, category, status } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '新闻ID不能为空' },
        { status: 400 }
      )
    }
    
    await connectDB()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 500 }
      )
    }
    
    const updateData: any = { updatedAt: new Date() }
    if (title) updateData.title = title
    if (content) updateData.content = content
    if (category) updateData.category = category
    if (status) updateData.status = status
    
    const result = await db.collection('news').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: '新闻不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('更新新闻失败:', error)
    return NextResponse.json(
      { success: false, error: '更新新闻失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: '新闻ID不能为空' },
        { status: 400 }
      )
    }
    
    await connectDB()
    const db = mongoose.connection.db
    if (!db) {
      return NextResponse.json(
        { success: false, error: '数据库连接失败' },
        { status: 500 }
      )
    }
    
    const result = await db.collection('news').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    )
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: '新闻不存在' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('删除新闻失败:', error)
    return NextResponse.json(
      { success: false, error: '删除新闻失败' },
      { status: 500 }
    )
  }
}