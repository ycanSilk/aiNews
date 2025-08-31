import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== DELETE CATEGORY REQUEST START ===')
    console.log('DELETE request received for ID:', params.id)
    
    // 检查MongoDB连接
    console.log('Attempting to connect to MongoDB...')
    await connectDB()
    console.log('Database connected successfully')
    
    const id = params.id
    console.log('Category ID from params:', id)
    
    if (!id) {
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description, value } = body

    // 检查是否提供了至少一个可更新的字段
    const hasName = name && (name.zh || name.en)
    const hasDescription = description && (description.zh || description.en)
    const hasValue = value
    
    if (!hasName && !hasDescription && !hasValue) {
      return NextResponse.json(
        { error: 'At least one field (name, description, or value) must be provided for update' },
        { status: 400 }
      )
    }

    // 获取当前分类数据，用于保留未提供的字段
    const CategoryModel = mongoose.models.Category
    if (!CategoryModel) {
      return NextResponse.json(
        { error: 'Category model not available' },
        { status: 500 }
      )
    }
    const currentCategory = await CategoryModel.findById(id)
    if (!currentCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }
    


    // 检查分类名称是否已存在（排除当前分类）
    // 只有当提供了name字段时才进行名称重复检查
    let existingCategory = null
    if (name) {
      existingCategory = await CategoryModel.findOne({ 
        _id: { $ne: id },
        $or: [
          { 'name.zh': name.zh || '' },
          { 'name.en': name.en || '' }
        ]
      })
    }
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      )
    }

    // 使用用户提供的value字段，如果没有提供则基于名称生成
    let finalValue = value
    if (!finalValue && name) {
      const valueName = name.zh || name.en
      finalValue = valueName.toLowerCase().replace(/\s+/g, '-')
    } else if (!finalValue) {
      // 如果没有提供value且没有name，则保持原有的value
      finalValue = currentCategory.value
    }
    console.log('Final value field:', finalValue)
    
    // 构建更新对象，只更新提供的字段，保留未提供的字段
    const updateData: any = {
      value: finalValue,
      updatedAt: new Date()
    }
    
    // 处理name字段：如果提供了则使用新值，否则保留原值
    updateData.name = {
      zh: name?.zh || currentCategory?.name?.zh || '',
      en: name?.en || currentCategory?.name?.en || ''
    }
    
    // 处理description字段：如果提供了则使用新值，否则保留原值
    updateData.description = {
      zh: description?.zh || currentCategory?.description?.zh || '',
      en: description?.en || currentCategory?.description?.en || ''
    }
    
    const updated = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    console.log('Updated category object:', updated.toObject())
    
    return NextResponse.json(
      updated.toObject(),
      { status: 200 }
    )
  } catch (error) {
    console.error('=== ERROR UPDATING CATEGORY ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }
    console.error('=== ERROR UPDATING CATEGORY END ===')
    return NextResponse.json(
      { error: 'Failed to update category: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}