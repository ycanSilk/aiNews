import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import Article from '@/lib/models/Article'
import mongoose from 'mongoose'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    // 查找文章 - 使用宽松查询以处理字符串ID的情况
    let article = await Article.findOne({ 
      $or: [
        { _id: id },
        { semanticId: id }
      ]
    })
      .populate('category', 'name value')
      .populate('tags', 'name value')
      .populate('author', 'username email')
      .populate('relatedArticles', 'title summary slug publishedAt')
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // 检查文章状态（只有已发布文章可以公开访问，但管理员可以访问所有状态）
    // 这里暂时移除状态检查，允许所有状态的文章访问
    // 后续可以添加管理员权限验证
    
    // 增加浏览量
    article.views += 1
    await article.save()
    
    return NextResponse.json({
      success: true,
      data: article
    })
    
  } catch (error: any) {
    console.error('Error in GET /api/articles/[id]:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    const body = await request.json()
    
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    // 查找并更新文章
    const article = await Article.findByIdAndUpdate(
      id,
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('category', 'name value')
      .populate('tags', 'name value')
      .populate('author', 'username email')
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: article
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const { id } = params
    
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      )
    }
    
    // 查找并删除文章
    const article = await Article.findByIdAndDelete(id)
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}