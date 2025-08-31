'use client'

import { useState, useEffect } from 'react'

interface Tag {
  _id: string
  name: string
  description: string
  usageCount: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [newTag, setNewTag] = useState({ name: '', description: '' })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setTags(data)
      } else {
        console.error('Failed to load tags')
      }
    } catch (error) {
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) return

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTag),
      })

      if (response.ok) {
        setNewTag({ name: '', description: '' })
        loadTags()
      } else {
        console.error('Failed to create tag')
      }
    } catch (error) {
      console.error('Error creating tag:', error)
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (!confirm('确定要删除这个标签吗？')) return

    try {
      const response = await fetch(`/api/tags/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadTags()
      } else {
        console.error('Failed to delete tag')
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">标签管理</h1>
        <p className="text-gray-600 mt-2">管理系统文章标签</p>
      </div>

      {/* 添加标签表单 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">添加新标签</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签名称</label>
            <input
              type="text"
              value={newTag.name}
              onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入标签名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">标签描述</label>
            <input
              type="text"
              value={newTag.description}
              onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="输入标签描述"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCreateTag}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              添加标签
            </button>
          </div>
        </div>
      </div>

      {/* 标签列表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">标签列表</h2>
          <button 
            onClick={loadTags}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            刷新
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">加载中...</div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用次数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tag.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.usageCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                      <button 
                        onClick={() => handleDeleteTag(tag._id)}
                        className="text-red-600 hover:text-red-900"
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