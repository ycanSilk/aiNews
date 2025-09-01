import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'
// 确保先导入基础模型，再导入依赖模型
import Category from '@/lib/models/Category'
import Tag from '@/lib/models/Tag'
import User from '@/lib/models/User'
import Article from '@/lib/models/Article'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const isHot = searchParams.get('isHot')
    const isImportant = searchParams.get('isImportant')
    const isCritical = searchParams.get('isCritical')
    
    // 调试输出 - 请求参数
    console.log('=== GET /api/articles 请求参数 ===')
    console.log('URL:', request.url)
    console.log('page:', page)
    console.log('limit:', limit)
    console.log('category:', category)
    console.log('tag:', tag)
    console.log('status:', status)
    console.log('search:', search)
    console.log('isHot:', isHot)
    console.log('isImportant:', isImportant)
    console.log('isCritical:', isCritical)
    
    // 构建查询条件
    const query: any = {}
    
    if (category) {
      query.category = category
    }
    
    if (tag) {
      query.tags = tag
    }
    
    if (status) {
      query.status = status
    }
    
    if (isHot === 'true') {
      query.isHot = true
    }
    
    if (isImportant === 'true') {
      query.isImportant = true
    }
    
    if (isCritical === 'true') {
      query.isCritical = true
    }
    
    // 全文搜索
    if (search) {
      query.$text = { $search: search }
    }
    
    // 调试输出 - 查询条件
    console.log('=== 查询条件 ===')
    console.log('query:', JSON.stringify(query, null, 2))
    
    // 执行查询
    console.log('=== 开始执行查询 ===')
    const articles = await Article.find(query)
      .populate('category', 'name value')
      .populate('tags', 'name value')
      .populate('author', 'username email')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
    
    // 获取总数用于分页
    const total = await Article.countDocuments(query)
    
    // 调试输出 - 查询结果
    console.log('=== 查询结果 ===')
    console.log('找到文章数量:', articles.length)
    console.log('总文章数:', total)
    if (articles.length > 0) {
      console.log('第一篇文章结构:', JSON.stringify({
        _id: articles[0]._id,
        semanticId: articles[0].semanticId,
        title: articles[0].title,
        category: articles[0].category,
        status: articles[0].status
      }, null, 2))
    }
    
    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error: any) {
    // 调试输出 - 错误信息
    console.error('=== GET /api/articles 错误 ===')
    console.error('错误信息:', error.message)
    console.error('错误堆栈:', error.stack)
    console.error('错误详情:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const body = await request.json()
    
    // 调试输出：显示接收到的请求数据
    console.log('=== POST /api/articles 请求数据 ===')
    console.log('请求体:', JSON.stringify(body, null, 2))
    
    // 验证必需字段
    const requiredFields = ['semanticId', 'title', 'summary', 'content', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        console.error(`缺少必需字段: ${field}`)
        console.error(`当前字段值:`, body[field])
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // 处理可选字段，提供默认值
    if (!body.author) {
      body.author = 'unknown'
    }
    
    // 处理tags字段转换 - 如果tags是字符串数组，需要转换为ObjectId
    let processedTags = body.tags || []
    if (processedTags.length > 0 && typeof processedTags[0] === 'string') {
      // 这里假设tags是字符串数组，需要根据实际情况处理
      // 在实际应用中，可能需要查询数据库获取对应的Tag ObjectId
      processedTags = processedTags.map(tag => new mongoose.Types.ObjectId())
    }
    
    // 创建新文章
    const article = new Article({
      semanticId: body.semanticId,
      title: body.title,
      summary: body.summary,
      content: body.content,
      category: body.category,
      tags: processedTags,
      author: body.author,
      publishedAt: body.publishedAt || null,
      readTime: body.readTime || 5,
      slug: body.slug,
      isFeatured: body.isFeatured || false,
      seo: body.seo,
      relatedArticles: body.relatedArticles || []
    })
    
    await article.save()
    
    // 填充关联数据
    await article.populate('category', 'name value')
    await article.populate('tags', 'name value')
    await article.populate('author', 'username email')
    
    return NextResponse.json({
      success: true,
      data: article
    }, { status: 201 })
    
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