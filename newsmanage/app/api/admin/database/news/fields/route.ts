import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import News from '@/lib/models/News'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('字段修改请求:', body)
    
    const { operation, oldFieldName, newFieldName } = body
    
    if (operation !== 'rename') {
      return NextResponse.json(
        { success: false, error: '不支持的操作类型' },
        { status: 400 }
      )
    }
    
    if (!oldFieldName || !newFieldName) {
      return NextResponse.json(
        { success: false, error: '字段名不能为空' },
        { status: 400 }
      )
    }
    
    await connectDB()
    
    // 更新所有文档中的字段名
    const result = await News.updateMany(
      { [oldFieldName]: { $exists: true } },
      { $rename: { [oldFieldName]: newFieldName } }
    )
    
    console.log('字段重命名结果:', result)
    
    return NextResponse.json({
      success: true,
      message: `字段重命名成功，影响 ${result.modifiedCount} 个文档`,
      modifiedCount: result.modifiedCount
    })
    
  } catch (error) {
    console.error('字段修改错误:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误类型' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('字段删除请求:', body)
    
    const { fieldName } = body
    
    if (!fieldName) {
      return NextResponse.json(
        { success: false, error: '字段名不能为空' },
        { status: 400 }
      )
    }
    
    await connectDB()
    
    // 删除所有文档中的字段
    const result = await News.updateMany(
      {},
      { $unset: { [fieldName]: "" } }
    )
    
    console.log('字段删除结果:', result)
    
    return NextResponse.json({
      success: true,
      message: `字段删除成功，影响 ${result.modifiedCount} 个文档`,
      modifiedCount: result.modifiedCount
    })
    
  } catch (error) {
    console.error('字段删除错误:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误类型' },
      { status: 500 }
    )
  }
}