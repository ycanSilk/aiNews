import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'
import TagModel from '@/lib/models/Tag'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== GET TAG BY ID REQUEST START ===')
    console.log('GET request received for ID:', params.id)
    
    await connectDB()
    console.log('Database connected successfully')
    
    const id = params.id
    console.log('Tag ID from params:', id)
    
    if (!id) {
      console.log('Invalid ID received:', id)
      console.log('=== GET TAG BY ID REQUEST END ===')
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }

    // 检查ID格式是否为有效的MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id)
      console.log('=== GET TAG BY ID REQUEST END ===')
      return NextResponse.json(
        { error: 'Invalid tag ID format' },
        { status: 400 }
      )
    }

    console.log('Tag model loaded, attempting to find ID:', id)
    
    const tag = await TagModel.findById(id)
    console.log('Tag found:', tag ? tag._id : 'null')
    
    if (!tag) {
      console.log('Tag not found with ID:', id)
      console.log('=== GET TAG BY ID REQUEST END ===')
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    console.log('Tag retrieved successfully:', tag._id)
    console.log('=== GET TAG BY ID REQUEST END ===')
    return NextResponse.json(tag.toObject())
  } catch (error) {
    console.error('=== ERROR GETTING TAG ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }
    console.error('=== ERROR GETTING TAG END ===')
    return NextResponse.json(
      { error: 'Failed to get tag: ' + (error instanceof Error ? error.message : String(error)) },
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
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description, color, isActive } = body

    // 检查是否提供了至少一个可更新的字段
    const hasName = name && (name.zh || name.en)
    const hasDescription = description && (description.zh || description.en)
    const hasColor = color
    const hasIsActive = typeof isActive !== 'undefined'
    
    if (!hasName && !hasDescription && !hasColor && !hasIsActive) {
      return NextResponse.json(
        { error: 'At least one field (name, description, color, or isActive) must be provided for update' },
        { status: 400 }
      )
    }

    // 获取当前标签数据，用于保留未提供的字段
    const currentTag = await TagModel.findById(id)
    if (!currentTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    // 检查标签名称是否已存在（排除当前标签）
    // 只有当提供了name字段时才进行名称重复检查
    let existingTag = null
    if (name) {
      existingTag = await TagModel.findOne({ 
        _id: { $ne: id },
        $or: [
          { 'name.zh': name.zh || '' },
          { 'name.en': name.en || '' }
        ]
      })
    }
    
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      )
    }

    // 构建更新对象，只更新提供的字段，保留未提供的字段
    const updateData: any = {
      updatedAt: new Date()
    }
    
    // 处理name字段：如果提供了则使用新值，否则保留原值
    if (name) {
      updateData.name = {
        zh: name.zh || currentTag.name?.zh || '',
        en: name.en || currentTag.name?.en || ''
      }
    }
    
    // 处理description字段：如果提供了则使用新值，否则保留原值
    if (description) {
      updateData.description = {
        zh: description.zh || currentTag.description?.zh || '',
        en: description.en || currentTag.description?.en || ''
      }
    }
    
    // 处理color字段
    if (color) {
      updateData.color = color
    }
    
    // 处理isActive字段
    if (typeof isActive !== 'undefined') {
      updateData.isActive = isActive
    }

    const updated = await TagModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated.toObject())
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== DELETE TAG REQUEST START ===')
    console.log('DELETE request received for ID:', params.id)
    
    // 检查MongoDB连接
    console.log('Attempting to connect to MongoDB...')
    await connectDB()
    console.log('Database connected successfully')
    
    const id = params.id
    console.log('Tag ID from params:', id)
    
    if (!id) {
      console.log('Invalid ID received:', id)
      console.log('=== DELETE TAG REQUEST END ===')
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }

    // 检查ID格式是否为有效的MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format:', id)
      console.log('=== DELETE TAG REQUEST END ===')
      return NextResponse.json(
        { error: 'Invalid tag ID format' },
        { status: 400 }
      )
    }

    console.log('Tag model loaded, attempting to delete ID:', id)
    
    // 检查标签是否存在
    console.log('Checking if tag exists...')
    const existingTag = await TagModel.findById(id)
    console.log('Existing tag found:', existingTag ? existingTag._id : 'null')
    
    if (!existingTag) {
      console.log('Tag not found with ID:', id)
      console.log('=== DELETE TAG REQUEST END ===')
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    console.log('Attempting to delete tag...')
    const deleted = await TagModel.findByIdAndDelete(id)
    
    if (!deleted) {
      console.log('Failed to delete tag with ID:', id)
      console.log('=== DELETE TAG REQUEST END ===')
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    console.log('Tag deleted successfully:', deleted._id)
    console.log('=== DELETE TAG REQUEST END ===')
    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('=== ERROR DELETING TAG ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Error stack:', error.stack)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }
    console.error('=== ERROR DELETING TAG END ===')
    return NextResponse.json(
      { error: 'Failed to delete tag: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    )
  }
}