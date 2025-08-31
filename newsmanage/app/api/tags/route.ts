import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import TagModel from '@/lib/models/Tag'

export async function GET() {
  try {
    console.log('=== GET TAGS API CALL ===')
    console.log('Connecting to database...')
    await connectDB()
    console.log('Database connected successfully')
    
    console.log('Tag model available:', !!TagModel)
    
    if (!TagModel) {
      console.log('Tag model not found, returning empty array')
      return NextResponse.json([])
    }
    
    console.log('Querying tags collection...')
    const tags = await TagModel.find({ isActive: true }).sort({ createdAt: -1 })
    console.log('Tags found:', tags.length)
    
    if (tags.length > 0) {
      console.log('First tag sample:', JSON.stringify(tags[0].toObject()))
    }
    
    // 转换为普通对象
    const formattedTags = tags.map(tag => tag.toObject())
    
    console.log('=== GET TAGS API COMPLETE ===')
    return NextResponse.json(formattedTags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    // 如果集合不存在或其他错误，返回空数组
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    // 检查至少一个语言版本的名称不为空
    if (!name || (!name.zh && !name.en)) {
      return NextResponse.json(
        { error: 'Tag name is required in at least one language' },
        { status: 400 }
      )
    }

    await connectDB()
    
    // 检查标签是否已存在
    const existingTag = await TagModel.findOne({ 
      $or: [
        { 'name.zh': name.zh || '' },
        { 'name.en': name.en || '' }
      ]
    })
    
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      )
    }

    // 生成value字段，优先使用中文名称，如果没有则使用英文名称
    const valueName = name.zh || name.en
    if (!valueName) {
      return NextResponse.json(
        { error: 'Tag name is required to generate value field' },
        { status: 400 }
      )
    }
    
    // 创建新标签
    const newTag = new TagModel({
      name: { zh: name.zh || '', en: name.en || '' },
      value: valueName.toLowerCase().replace(/\\s+/g, '-'),
      description: { zh: description?.zh || '', en: description?.en || '' },
      color: color || '#3B82F6',
      isActive: true,
      articleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const savedTag = await newTag.save()
    
    return NextResponse.json(
      savedTag.toObject(),
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const result = await db.collection('tags').deleteOne({ _id: id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Tag deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}