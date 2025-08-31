import { NextRequest } from 'next/server'
import {
  handleGetRequest,
  handlePostRequest,
  handlePutRequest,
  handleDeleteRequest
} from '@/lib/database/operations'

export async function GET() {
  console.log('GET /api/admin/database/adminuser - 开始获取用户数据')
  return handleGetRequest('adminuser')
}

export async function POST(request: NextRequest) {
  console.log('POST /api/admin/database/adminuser - 开始处理字段操作')
  return handlePostRequest(request, 'adminuser')
}

export async function PUT(request: NextRequest) {
  console.log('PUT /api/admin/database/adminuser - 开始更新字段值')
  return handlePutRequest(request, 'adminuser')
}

export async function DELETE(request: NextRequest) {
  console.log('DELETE /api/admin/database/adminuser - 开始删除字段')
  return handleDeleteRequest(request, 'adminuser')
}