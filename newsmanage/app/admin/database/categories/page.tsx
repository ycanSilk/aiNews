'use client'

import { useState, useEffect } from 'react'

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
  __v: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading categories...')
      const response = await fetch('/api/categories')
      
      if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Categories loaded:', data.length)
      // 调试输出：显示所有分类的value字段
      data.forEach((category: any) => {
        console.log(`Category ${category.name.zh || category.name.en}: value = ${category.value}`)
      })
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    console.log('=== DELETE CATEGORY CLICKED ===')
    console.log('Category ID:', categoryId)
    console.log('Category Name:', categoryName)
    
    if (!confirm(`确定要删除分类 "${categoryName}" 吗？此操作不可撤销。`)) {
      console.log('Delete operation cancelled by user')
      return
    }

    try {
      console.log('Sending DELETE request to API...')
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('DELETE response status:', response.status)
      console.log('DELETE response headers:', Object.fromEntries(response.headers.entries()))

      const result = await response.json()
      console.log('DELETE response data:', result)

      if (response.ok) {
        console.log('Category deleted successfully, reloading categories...')
        // 重新加载分类列表
        await loadCategories()
        console.log('Categories reloaded successfully')
      } else {
        console.error('Failed to delete category:', result.error)
        alert(`删除失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('删除分类时发生错误，请查看控制台日志')
    }
  }

  const handleEditCategory = async (categoryId: string) => {
    console.log('=== EDIT CATEGORY CLICKED ===')
    console.log('Category ID:', categoryId)
    
    // 查找要编辑的分类
    const categoryToEdit = categories.find(cat => cat._id === categoryId)
    if (!categoryToEdit) {
      console.error('Category not found for editing:', categoryId)
      alert('找不到要编辑的分类')
      return
    }

    console.log('Category to edit:', categoryToEdit)
    console.log('Current value field:', categoryToEdit.value)
    
    // 这里可以打开一个模态框或表单来编辑分类信息
    // 暂时使用简单的prompt来演示
    const newNameZh = prompt('请输入中文分类名称:', categoryToEdit.name.zh)
    if (newNameZh === null) {
      console.log('Edit operation cancelled by user')
      return
    }

    const newNameEn = prompt('请输入英文分类名称:', categoryToEdit.name.en)
    if (newNameEn === null) {
      console.log('Edit operation cancelled by user')
      return
    }

    const newDescriptionZh = prompt('请输入中文描述:', categoryToEdit.description.zh)
    const newDescriptionEn = prompt('请输入英文描述:', categoryToEdit.description.en)

    try {
      console.log('Sending PUT request to update category...')
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: {
            zh: newNameZh || '',
            en: newNameEn || ''
          },
          description: {
            zh: newDescriptionZh || '',
            en: newDescriptionEn || ''
          }
        })
      })

      console.log('PUT response status:', response.status)
      const result = await response.json()
      console.log('PUT response data:', result)

      if (response.ok) {
        console.log('Category updated successfully, reloading categories...')
        console.log('Updated value field:', result.value)
        alert('分类更新成功！')
        // 重新加载分类列表
        await loadCategories()
        console.log('Categories reloaded successfully')
        // 检查重新加载后的分类数据
        const updatedCategory = categories.find(cat => cat._id === categoryId)
        if (updatedCategory) {
          console.log('Reloaded category value:', updatedCategory.value)
        }
      } else {
        console.error('Failed to update category:', result.error)
        alert(`更新失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('更新分类时发生错误，请查看控制台日志')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-700">{error}</div>
          <button 
            onClick={loadCategories}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">分类表管理</h1>
        <p className="text-gray-600 mt-2">管理系统文章分类数据表</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            分类列表 ({categories.length})
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            添加分类
          </button>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无分类数据
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文章数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.name.zh}
                      {category.name.en && (
                        <div className="text-xs text-gray-400">{category.name.en}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description.zh}
                      {category.description.en && (
                        <div className="text-xs text-gray-400">{category.description.en}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.articleCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditCategory(category._id)}
                      >
                        编辑
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteCategory(category._id, category.name.zh || category.name.en || 'Unnamed Category')}
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
    </div>
  )
}