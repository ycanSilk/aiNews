import { ObjectId } from 'mongodb'
import connectDB from '@/lib/database/mongodb'
import mongoose from 'mongoose'

export interface Category {
  _id?: string | ObjectId
  name: { zh: string; en: string }
  value: string
  description: { zh: string; en: string }
  displayOrder: number
  isActive: boolean
  articleCount: number
  createdAt: Date
  updatedAt: Date
}

export class CategoryOperations {
  /**
   * 获取所有分类
   */
  static async getAllCategories(): Promise<Category[]> {
    try {
      const db = await connectDB()
      
      // 检查集合是否存在
      const collections = await db.listCollections().toArray()
      const collectionExists = collections.some((col: { name: string }) => col.name === 'categories')
      
      if (!collectionExists) {
        return []
      }
      
      const categories = await db.collection('categories').find({}).toArray()
      return categories.map((cat: any) => ({
        ...cat,
        _id: cat._id.toString(),
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt)
      }))
    } catch (error) {
      console.error('获取分类列表失败:', error)
      return []
    }
  }

  /**
   * 根据ID获取分类
   */
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const db = await connectDB()
      const category = await db.collection('categories').findOne({ _id: new ObjectId(id) })
      
      if (!category) return null
      
      return {
        ...category,
        _id: category._id.toString(),
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
      return null
    }
  }

  /**
   * 创建新分类
   */
  static async createCategory(categoryData: Omit<Category, '_id' | 'articleCount' | 'createdAt' | 'updatedAt'>): Promise<Category | null> {
    try {
      const db = await connectDB()
      
      // 检查分类名称是否已存在
      const existingCategory = await db.collection('categories').findOne({ 
        name: categoryData.name 
      })
      
      if (existingCategory) {
        throw new Error('分类名称已存在')
      }

      const newCategory = {
      ...categoryData,
      articleCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

      const result = await db.collection('categories').insertOne(newCategory)
      
      return {
        ...newCategory,
        _id: result.insertedId.toString()
      }
    } catch (error) {
      console.error('创建分类失败:', error)
      throw error
    }
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: string, updateData: Partial<Omit<Category, '_id' | 'articleCount' | 'createdAt'>>): Promise<boolean> {
    try {
      const db = await connectDB()
      
      // 如果更新名称，检查名称是否已存在（排除当前分类）
      if (updateData.name) {
        const existingCategory = await db.collection('categories').findOne({ 
          name: updateData.name,
          _id: { $ne: new ObjectId(id) }
        })
        
        if (existingCategory) {
          throw new Error('分类名称已存在')
        }
      }

      const result = await db.collection('categories').updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...updateData,
            updatedAt: new Date()
          }
        }
      )

      return result.modifiedCount > 0
    } catch (error) {
      console.error('更新分类失败:', error)
      throw error
    }
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: string): Promise<boolean> {
    try {
      const db = await connectDB()
      let objectId
      
      // 处理不同类型的ID
      if (ObjectId.isValid(id)) {
        objectId = new ObjectId(id)
      } else {
        // 如果ID不是有效的ObjectId，尝试作为字符串查找
        objectId = id
      }
      
      const result = await db.collection('categories').deleteOne({ _id: objectId })
      return result.deletedCount > 0
    } catch (error) {
      console.error('删除分类失败:', error)
      throw error
    }
  }

  /**
   * 增加分类文章计数
   */
  static async incrementArticleCount(categoryId: string): Promise<boolean> {
    try {
      const db = await connectDB()
      const result = await db.collection('categories').updateOne(
        { _id: new ObjectId(categoryId) },
        { $inc: { articleCount: 1 } }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('增加文章计数失败:', error)
      return false
    }
  }

  /**
   * 减少分类文章计数
   */
  static async decrementArticleCount(categoryId: string): Promise<boolean> {
    try {
      const db = await connectDB()
      const result = await db.collection('categories').updateOne(
        { _id: new ObjectId(categoryId) },
        { $inc: { articleCount: -1 } }
      )
      return result.modifiedCount > 0
    } catch (error) {
      console.error('减少文章计数失败:', error)
      return false
    }
  }
}