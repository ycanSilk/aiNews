import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const comments = await request.json()
    
    const filePath = path.join(process.cwd(), 'app', 'admin', 'database', 'news', 'field-comments.json')
    const dirPath = path.dirname(filePath)
    
    // 确保目录存在
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    
    // 保存到文件
    fs.writeFileSync(filePath, JSON.stringify(comments, null, 2))
    
    return NextResponse.json({
      success: true,
      message: '注释保存成功'
    })
  } catch (error) {
    console.error('保存注释文件失败:', error)
    return NextResponse.json(
      { success: false, error: '保存注释文件失败' },
      { status: 500 }
    )
  }
}