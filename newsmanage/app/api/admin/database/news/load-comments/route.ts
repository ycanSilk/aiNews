import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'app', 'admin', 'database', 'news', 'field-comments.json')
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const comments = JSON.parse(fileContent)
      
      return NextResponse.json({
        success: true,
        data: comments
      })
    } else {
      // 如果文件不存在，返回空对象
      return NextResponse.json({
        success: true,
        data: {}
      })
    }
  } catch (error) {
    console.error('加载注释文件失败:', error)
    return NextResponse.json(
      { success: false, error: '加载注释文件失败' },
      { status: 500 }
    )
  }
}