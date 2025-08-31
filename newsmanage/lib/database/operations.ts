import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'

export interface FieldOperation {
  type: 'add' | 'remove' | 'rename'
  fieldName: string
  newFieldName?: string
  fieldType?: string
  fieldValue?: any
  targetId: string
}

export interface DatabaseOperationResult {
  success: boolean
  message?: string
  error?: string
  dbResult?: any
}

export class DatabaseOperations {
  /**
   * 获取集合中的所有数据
   */
  static async getCollectionData(collectionName: string) {
    try {
      await connectDB()
      const db = mongoose.connection.db
      
      const items = await db.collection(collectionName).find({}).toArray()
      
      // 提取所有字段
      const allFields = new Set<string>()
      items.forEach(item => {
        Object.keys(item).forEach(key => {
          allFields.add(key)
        })
      })
      
      return {
        success: true,
        data: {
          items,
          fields: Array.from(allFields)
        }
      }
    } catch (error) {
      console.error(`获取 ${collectionName} 数据失败:`, error)
      return {
        success: false,
        error: `获取 ${collectionName} 数据失败`
      }
    }
  }

  /**
   * 执行字段操作
   */
  static async executeFieldOperations(
    collectionName: string,
    operations: FieldOperation[]
  ): Promise<{ success: boolean; data?: { results: DatabaseOperationResult[] }; error?: string }> {
    try {
      if (!operations || !Array.isArray(operations) || operations.length === 0) {
        return {
          success: false,
          error: '无效的操作数据'
        }
      }
      
      await connectDB()
      const db = mongoose.connection.db
      
      const results: DatabaseOperationResult[] = []
      
      for (const operation of operations) {
        try {
          // 只有当targetId存在且不为空时才转换为ObjectId
          const targetId = operation.targetId && operation.targetId.trim() !== '' 
            ? new mongoose.Types.ObjectId(operation.targetId) 
            : null
          
          switch (operation.type) {
            case 'add':
              // 对于添加字段操作，如果targetId为空，则对整个集合操作
              if (!targetId) {
                const addResult = await db.collection(collectionName).updateMany(
                  {},
                  { $set: { [operation.fieldName]: operation.fieldValue } }
                )
                
                results.push({
                  success: true,
                  message: '字段添加成功（整个集合）',
                  dbResult: addResult
                })
              } else {
                const addResult = await db.collection(collectionName).updateOne(
                  { _id: targetId },
                  { $set: { [operation.fieldName]: operation.fieldValue } }
                )
                
                results.push({
                  success: true,
                  message: '字段添加成功（单条记录）',
                  dbResult: addResult
                })
              }
              break
              
            case 'remove':
              const removeResult = await db.collection(collectionName).updateOne(
                { _id: targetId },
                { $unset: { [operation.fieldName]: '' } }
              )
              
              results.push({
                success: true,
                message: '字段删除成功',
                dbResult: removeResult
              })
              break
              
            case 'rename':
              if (!operation.newFieldName) {
                results.push({
                  success: false,
                  error: '新字段名不能为空'
                })
                break
              }
              
              // 先获取当前值，然后重命名字段
              const item = await db.collection(collectionName).findOne({ _id: targetId })
              
              if (item && item[operation.fieldName] !== undefined) {
                const renameResult = await db.collection(collectionName).updateOne(
                  { _id: targetId },
                  {
                    $set: { [operation.newFieldName]: item[operation.fieldName] },
                    $unset: { [operation.fieldName]: '' }
                  }
                )
                
                results.push({
                  success: true,
                  message: '字段重命名成功',
                  dbResult: renameResult
                })
              } else {
                results.push({
                  success: false,
                  error: '字段不存在'
                })
              }
              break
          }
        } catch (error) {
          console.error('操作执行错误:', error)
          results.push({
            success: false,
            error: error.message
          })
        }
      }
      
      return {
        success: true,
        data: { results }
      }
      
    } catch (error) {
      console.error('执行字段操作失败:', error)
      return {
        success: false,
        error: '执行字段操作失败'
      }
    }
  }

  /**
   * 更新字段值
   */
  static async updateFieldValue(
    collectionName: string,
    targetId: string,
    fieldName: string,
    fieldValue: any
  ): Promise<DatabaseOperationResult> {
    try {
      if (!targetId || !fieldName) {
        return {
          success: false,
          error: '目标ID和字段名不能为空'
        }
      }
      
      await connectDB()
      const db = mongoose.connection.db
      
      await db.collection(collectionName).updateOne(
        { _id: new mongoose.Types.ObjectId(targetId) },
        { $set: { [fieldName]: fieldValue } }
      )
      
      return {
        success: true,
        message: '字段更新成功'
      }
      
    } catch (error) {
      console.error('更新字段值失败:', error)
      return {
        success: false,
        error: '更新字段值失败'
      }
    }
  }

  /**
   * 删除字段
   */
  static async deleteField(
    collectionName: string,
    targetId: string,
    fieldName: string
  ): Promise<DatabaseOperationResult> {
    try {
      if (!targetId || !fieldName) {
        return {
          success: false,
          error: '目标ID和字段名不能为空'
        }
      }
      
      await connectDB()
      const db = mongoose.connection.db
      
      await db.collection(collectionName).updateOne(
        { _id: new mongoose.Types.ObjectId(targetId) },
        { $unset: { [fieldName]: '' } }
      )
      
      return {
        success: true,
        message: '字段删除成功'
      }
      
    } catch (error) {
      console.error('删除字段失败:', error)
      return {
        success: false,
        error: '删除字段失败'
      }
    }
  }

  /**
   * 解析字段值
   */
  static parseFieldValue(value: string, type: string): any {
    switch (type) {
      case 'number':
        return Number(value)
      case 'boolean':
        return value.toLowerCase() === 'true'
      case 'object':
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      case 'array':
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      default:
        return value
    }
  }

  /**
   * 创建标准的API响应
   */
  static createApiResponse(
    success: boolean,
    data?: any,
    error?: string,
    status: number = success ? 200 : 500
  ): NextResponse {
    return NextResponse.json(
      { success, data, error },
      { status }
    )
  }
}

/**
 * 通用的GET请求处理函数
 */
export async function handleGetRequest(collectionName: string) {
  try {
    const result = await DatabaseOperations.getCollectionData(collectionName)
    
    if (result.success) {
      return DatabaseOperations.createApiResponse(true, result.data)
    } else {
      return DatabaseOperations.createApiResponse(false, null, result.error)
    }
  } catch (error) {
    console.error(`处理 ${collectionName} GET请求失败:`, error)
    return DatabaseOperations.createApiResponse(false, null, '获取数据失败')
  }
}

/**
 * 通用的POST请求处理函数（用于字段操作）
 */
export async function handlePostRequest(
  request: NextRequest,
  collectionName: string
) {
  try {
    const { operations }: { operations: FieldOperation[] } = await request.json()
    
    const result = await DatabaseOperations.executeFieldOperations(
      collectionName,
      operations.map(op => ({
        ...op,
        targetId: op.targetId
      }))
    )
    
    if (result.success) {
      return DatabaseOperations.createApiResponse(true, result.data)
    } else {
      return DatabaseOperations.createApiResponse(false, null, result.error)
    }
  } catch (error) {
    console.error(`处理 ${collectionName} POST请求失败:`, error)
    return DatabaseOperations.createApiResponse(false, null, '执行操作失败')
  }
}

/**
 * 通用的PUT请求处理函数（用于更新字段值）
 */
export async function handlePutRequest(
  request: NextRequest,
  collectionName: string
) {
  try {
    const { targetId, fieldName, fieldValue }: {
      targetId: string
      fieldName: string
      fieldValue: any
    } = await request.json()
    
    const result = await DatabaseOperations.updateFieldValue(
      collectionName,
      targetId,
      fieldName,
      fieldValue
    )
    
    if (result.success) {
      return DatabaseOperations.createApiResponse(true, { message: result.message })
    } else {
      return DatabaseOperations.createApiResponse(false, null, result.error)
    }
  } catch (error) {
    console.error(`处理 ${collectionName} PUT请求失败:`, error)
    return DatabaseOperations.createApiResponse(false, null, '更新字段失败')
  }
}

/**
 * 通用的DELETE请求处理函数（用于删除字段）
 */
export async function handleDeleteRequest(
  request: NextRequest,
  collectionName: string
) {
  try {
    const { targetId, fieldName }: {
      targetId: string
      fieldName: string
    } = await request.json()
    
    const result = await DatabaseOperations.deleteField(
      collectionName,
      targetId,
      fieldName
    )
    
    if (result.success) {
      return DatabaseOperations.createApiResponse(true, { message: result.message })
    } else {
      return DatabaseOperations.createApiResponse(false, null, result.error)
    }
  } catch (error) {
    console.error(`处理 ${collectionName} DELETE请求失败:`, error)
    return DatabaseOperations.createApiResponse(false, null, '删除字段失败')
  }
}