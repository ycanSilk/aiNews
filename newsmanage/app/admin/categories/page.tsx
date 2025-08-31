'use client'

import { useState, useEffect } from 'react'
import type { JSX } from 'react'

interface Category {
  _id: string
  name: {
    zh: string
    en: string
  }
  description: {
    zh: string
    en: string
  }
  value: string
  displayOrder: number
  isActive: boolean
  articleCount: number
  createdAt: string
  updatedAt: string
  [key: string]: any
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ 
    name: { zh: '', en: '' }, 
    description: { zh: '', en: '' },
    value: ''
  })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [tableFields, setTableFields] = useState<string[]>(['_id', 'name', 'description', 'articleCount'])

  useEffect(() => {
    loadTableSchema()
    loadCategories()
  }, [])

  const loadTableSchema = async () => {
    try {
      const response = await fetch('/api/categories/schema')
      if (response.ok) {
        const data = await response.json()
        if (data.fields && data.fields.length > 0) {
          // 保留固定的字段，添加其他动态字段
          const dynamicFields = data.fields.filter(
            (field: string) => !['_id', 'name', 'description', 'articleCount'].includes(field)
          )
          setTableFields(['_id', 'name', 'description', 'articleCount', ...dynamicFields])
        }
      }
    } catch (error) {
      console.error('Error loading table schema:', error)
    }
  }

  const loadCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        console.error('Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.zh.trim() && !newCategory.name.en.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (response.ok) {
        setNewCategory({ name: { zh: '', en: '' }, description: { zh: '', en: '' }, value: '' })
        loadCategories()
      } else {
        console.error('Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('确定要删除这个分类吗？')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadCategories()
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory || (!editingCategory.name.zh.trim() && !editingCategory.name.en.trim())) return

    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingCategory.name,
          description: editingCategory.description
        }),
      })

      if (response.ok) {
        setEditingCategory(null)
        loadCategories()
      } else {
        const errorData = await response.json()
        alert(errorData.error || '更新分类失败')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('更新分类失败')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
  }

  // 获取字段的显示名称
  const getFieldDisplayName = (field: string): string => {
    const fieldNames: { [key: string]: string } = {
      _id: 'ID',
      name: '分类名称',
      description: '描述',
      articleCount: '文章数量',
      value: '分类值',
      displayOrder: '显示顺序',
      isActive: '是否激活',
      createdAt: '创建时间',
      updatedAt: '更新时间'
    }
    return fieldNames[field] || field
  }

  // 渲染字段值
  const renderFieldValue = (category: Category, field: string): string | number | JSX.Element => {
    const value = category[field]
    
    if (value === null || value === undefined) {
      return '-'
    }

    // 处理多语言对象
    if (typeof value === 'object' && value !== null) {
      if (field === 'name') {
        return (
          <div>
            <div className="font-medium">中文: {value.zh || '-'}</div>
            <div className="text-sm text-gray-500">英文: {value.en || '-'}</div>
          </div>
        )
      }
      if (field === 'description') {
        return (
          <div>
            <div className="font-medium">中文: {value.zh || '-'}</div>
            <div className="text-sm text-gray-500">英文: {value.en || '-'}</div>
          </div>
        )
      }
      return JSON.stringify(value)
    }

    // 处理布尔值
    if (typeof value === 'boolean') {
      return value ? '是' : '否'
    }

    // 处理日期
    if (field === 'createdAt' || field === 'updatedAt') {
      return new Date(value).toLocaleString('zh-CN')
    }

    return value
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">分类管理</h1>
        <p className="text-gray-600 mt-2">管理系统文章分类</p>
      </div>

      {/* 添加分类表单 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">添加新分类</h2>
        <div className="space-y-4">
          {/* 分类名称多语言输入框 */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">分类名称</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">中文</label>
                <input
                  type="text"
                  value={newCategory.name.zh}
                  onChange={(e) => setNewCategory({ 
                    ...newCategory, 
                    name: { ...newCategory.name, zh: e.target.value }
                  })}
                  className="w-60 px-3 py-2 border rounded-md"
                  placeholder="输入中文分类名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">英文</label>
                <input
                  type="text"
                  value={newCategory.name.en}
                  onChange={(e) => setNewCategory({ 
                    ...newCategory, 
                    name: { ...newCategory.name, en: e.target.value }
                  })}
                  className="w-60 px-3 py-2 border rounded-md"
                  placeholder="输入英文分类名称"
                />
              </div>
            </div>
          </div>
          
          {/* 分类描述多语言输入框 */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">分类描述</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">中文</label>
                <input
                  type="text"
                  value={newCategory.description.zh}
                  onChange={(e) => setNewCategory({ 
                    ...newCategory, 
                    description: { ...newCategory.description, zh: e.target.value }
                  })}
                  className="w-60 px-3 py-2 border rounded-md"
                  placeholder="输入中文分类描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">英文</label>
                <input
                  type="text"
                  value={newCategory.description.en}
                  onChange={(e) => setNewCategory({ 
                    ...newCategory, 
                    description: { ...newCategory.description, en: e.target.value }
                  })}
                  className="w-60 px-3 py-2 border rounded-md"
                  placeholder="输入英文分类描述"
                />
              </div>
            </div>
          </div>
          
          {/* 分类值输入框 */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">分类值</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分类值</label>
              <input
                type="text"
                value={newCategory.value}
                onChange={(e) => setNewCategory({ 
                  ...newCategory, 
                  value: e.target.value
                })}
                className="w-60 px-3 py-2 border rounded-md"
                placeholder="输入分类值"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              onClick={handleCreateCategory}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              添加分类
            </button>
          </div>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">分类列表</h2>
          <button 
            onClick={loadCategories}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {tableFields.map((field) => (
                    <th key={field} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">
                      {getFieldDisplayName(field)}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-200">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    {tableFields.map((field) => (
                      <td 
                        key={field} 
                        className="px-6 py-4 text-sm text-gray-900 min-w-[100px] max-w-[200px] truncate border border-gray-200"
                        title={typeof renderFieldValue(category, field) === 'string' ? renderFieldValue(category, field) as string : ''}
                      >
                        {renderFieldValue(category, field)}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-200">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors mr-2"
                      >
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 编辑分类模态框 */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">编辑分类</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类名称 (中文)</label>
                <input
                  type="text"
                  value={editingCategory.name.zh}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: { ...editingCategory.name, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入中文分类名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类名称 (英文)</label>
                <input
                  type="text"
                  value={editingCategory.name.en}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    name: { ...editingCategory.name, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入英文分类名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类描述 (中文)</label>
                <input
                  type="text"
                  value={editingCategory.description.zh}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: { ...editingCategory.description, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入中文分类描述"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类描述 (英文)</label>
                <input
                  type="text"
                  value={editingCategory.description.en}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: { ...editingCategory.description, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入英文分类描述"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类值</label>
                <input
                  type="text"
                  value={editingCategory.value}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    value: e.target.value
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="输入分类值"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}