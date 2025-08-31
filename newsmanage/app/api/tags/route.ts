import { NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'

export async function GET() {
  try {
    const db = await connectDB()
    
    // 检查集合是否存在，如果不存在则返回空数组
    const collections = await db.listCollections().toArray()
    const collectionExists = collections.some((col: { name: string }) => col.name === 'tags')
    
    if (!collectionExists) {
      return NextResponse.json([])
    }
    
    const tags = await db.collection('tags').find({}).toArray()
    
    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    // 如果连接失败，返回空数组而不是错误
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      )
    }

    const db = await connectDB()
    
    // 检查标签是否已存在
    const existingTag = await db.collection('tags').findOne({ name })
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      )
    }

    const newTag = {
      name,
      description: description || '',
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('tags').insertOne(newTag)
    
    return NextResponse.json(
      { 
        _id: result.insertedId,
        ...newTag
      },
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