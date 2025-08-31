import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 预定义的分类表字段列表
    const fieldNames = [
      'name',
      'description', 
      'value',
      'displayOrder',
      'isActive',
      'articleCount',
      'createdAt',
      'updatedAt'
    ]
    
    return NextResponse.json({ 
      fields: fieldNames,
      message: 'Category schema fields retrieved successfully'
    })
    
  } catch (error) {
    console.error('Error fetching category schema:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category schema' },
      { status: 500 }
    )
  }
}