import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'
import CategoryModel from '@/lib/models/Category'

export async function GET() {
  try {
    console.log('=== GET CATEGORIES API CALL ===')
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully')
    
    // 使用导入的Category模型查询categories
    console.log('Category model available:', !!CategoryModel)
    
    if (!CategoryModel) {
      console.log('Category model not found, returning empty array')
      return NextResponse.json([])
    }
    
    console.log('Querying categories collection...')
    const categories = await CategoryModel.find({})
    console.log('Categories found:', categories.length)
    
    if (categories.length > 0) {
      console.log('First category sample:', JSON.stringify(categories[0].toObject()))
    }
    
    // 转换为普通对象
    const formattedCategories = categories.map(cat => cat.toObject())
    
    console.log('=== GET CATEGORIES API COMPLETE ===')
    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    // 如果集合不存在或其他错误，返回空数组
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    // 检查至少一个语言版本的名称不为空
    if (!name || (!name.zh && !name.en)) {
      return NextResponse.json(
        { error: 'Category name is required in at least one language' },
        { status: 400 }
      )
    }

    const mongoose = await connectDB()
    const db = mongoose.connection.db
    
    // 检查分类是否已存在
    const existingCategory = await db.collection('categories').findOne({ 
      $or: [
        { 'name.zh': name.zh || '' },
        { 'name.en': name.en || '' }
      ]
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      )
    }

    // 生成value字段，优先使用中文名称，如果没有则使用英文名称
    const valueName = name.zh || name.en
    if (!valueName) {
      return NextResponse.json(
        { error: 'Category name is required to generate value field' },
        { status: 400 }
      )
    }
    
    // 创建新分类
    const newCategory = {
      name: { zh: name.zh || '', en: name.en || '' },
      value: valueName.toLowerCase().replace(/\s+/g, '-'),
      description: { zh: description?.zh || '', en: description?.en || '' },
      displayOrder: 0,
      isActive: true,
      articleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('categories').insertOne(newCategory)
    const savedCategory = { ...newCategory, _id: result.insertedId }
    
    return NextResponse.json(
      savedCategory,
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB()
    
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    // 检查至少一个语言版本的名称不为空
    if (!name || (!name.zh && !name.en)) {
      return NextResponse.json(
        { error: 'Category name is required in at least one language' },
        { status: 400 }
      )
    }


    
    // 检查分类名称是否已存在（排除当前分类）
    const CategoryModel = mongoose.models.Category
    if (!CategoryModel) {
      return NextResponse.json(
        { error: 'Category model not available' },
        { status: 500 }
      )
    }
    const existingCategory = await CategoryModel.findOne({ 
      _id: { $ne: id },
      $or: [
        { 'name.zh': name.zh || '' },
        { 'name.en': name.en || '' }
      ]
    })
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      )
    }

    // 生成value字段，优先使用中文名称，如果没有则使用英文名称
    const valueName = name.zh || name.en
    
    const updated = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: { zh: name.zh || '', en: name.en || '' },
        value: valueName.toLowerCase().replace(/\s+/g, '-'),
        description: { zh: description?.zh || '', en: description?.en || '' },
        updatedAt: new Date()
      },
      { new: true }
    )
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      updated.toObject(),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    console.log('=== DELETE CATEGORY REQUEST START ===')
    console.log('DELETE request received:', request.url)
    
    // 检查MongoDB连接
    console.log('Attempting to connect to MongoDB...')
    await connectDB()
    console.log('Database connected successfully')
    
    const url = new URL(request.url)
    const pathParts = url.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    
    console.log('Extracted ID from URL:', id)
    console.log('Full path parts:', JSON.stringify(pathParts))
    console.log('Request method:', request.method)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    if (!id || id === 'categories') {
      console.log('Invalid ID received:', id)
      console.log('=== DELETE CATEGORY REQUEST END ===')
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // 检查ID格式是否为有效的MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id)
      console.log('=== DELETE CATEGORY REQUEST END ===')
      return NextResponse.json(
        { error: 'Invalid category ID format' },
        { status: 400 }
      )
    }


    
    console.log('Category model loaded, attempting to delete ID:', id)
    
    // 检查分类是否存在
    console.log('Checking if category exists...')
    const CategoryModel = mongoose.models.Category
    if (!CategoryModel) {
      console.log('Category model not available')
      return NextResponse.json(
        { error: 'Category model not available' },
        { status: 500 }
      )
    }
    const existingCategory = await CategoryModel.findById(id)
    console.log('Existing category found:', existingCategory ? existingCategory._id : 'null')
    
    if (!existingCategory) {
      console.log('Category not found with ID:', id)
      console.log('=== DELETE CATEGORY REQUEST END ===')
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Attempting to delete category...')
    const deleted = await CategoryModel.findByIdAndDelete(id)
    
    if (!deleted) {
      console.log('Failed to delete category with ID:', id)
      console.log('=== DELETE CATEGORY REQUEST END ===')
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Category deleted successfully:', deleted._id)
    console.log('=== DELETE CATEGORY REQUEST END ===')
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('=== ERROR DELETING CATEGORY ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }
    console.error('=== ERROR DELETING CATEGORY END ===')
    return NextResponse.json(
      { error: 'Failed to delete category: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}