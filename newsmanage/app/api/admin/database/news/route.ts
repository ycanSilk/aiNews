import { NextRequest } from 'next/server'
import {
  handleGetRequest,
  handlePostRequest,
  handlePutRequest,
  handleDeleteRequest
} from '@/lib/database/operations'

export async function GET() {
  console.log('GET /api/admin/database/news - 开始获取新闻数据')
  return handleGetRequest('news')
}

export async function POST(request: NextRequest) {
  console.log('POST /api/admin/database/news - 开始处理字段操作')
  return handlePostRequest(request, 'news')
}

export async function PUT(request: NextRequest) {
  console.log('PUT /api/admin/database/news - 开始更新字段值')
  return handlePutRequest(request, 'news')
}

export async function DELETE(request: NextRequest) {
  console.log('DELETE /api/admin/database/news - 开始删除字段')
  return handleDeleteRequest(request, 'news')
}