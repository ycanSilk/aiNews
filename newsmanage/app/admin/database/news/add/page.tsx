'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/layout/AdminLayout'

export default function AddNewsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: { zh: '', en: '' },
    summary: { zh: '', en: '' },
    content: '',
    category: '',
    tags: '',
    status: 'draft',
    author: '',
    featured: false,
    imageUrl: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLanguageInputChange = (field: string, lang: 'zh' | 'en', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 处理标签字符串为数组
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('新闻创建成功！')
        router.push('/admin/news')
      } else {
        alert(`创建失败: ${result.error}`)
      }
    } catch (error) {
      console.error('创建新闻失败:', error)
      alert('创建新闻时发生错误')
    } finally {
      setLoading(false)
    }
  }

  return (

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">添加新闻</h1>
          <p className="text-gray-600 mt-2">创建新的新闻内容</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {/* 标题 - 中英文 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中文标题 *
              </label>
              <input
                type="text"
                required
                value={formData.title.zh}
                onChange={(e) => handleLanguageInputChange('title', 'zh', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入中文标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                英文标题
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleLanguageInputChange('title', 'en', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入英文标题"
              />
            </div>
          </div>

          {/* 摘要 - 中英文 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                中文摘要
              </label>
              <textarea
                value={formData.summary.zh}
                onChange={(e) => handleLanguageInputChange('summary', 'zh', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入中文摘要"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                英文摘要
              </label>
              <textarea
                value={formData.summary.en}
                onChange={(e) => handleLanguageInputChange('summary', 'en', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入英文摘要"
              />
            </div>
          </div>

          {/* 内容 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新闻内容 *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入新闻内容"
            />
          </div>

          {/* 分类和标签 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入分类"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签（用逗号分隔）
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：AI,科技,新闻"
              />
            </div>
          </div>

          {/* 状态和作者 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
                <option value="archived">已归档</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作者
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入作者名称"
              />
            </div>
          </div>

          {/* 特色和图片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">设为特色新闻</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="输入图片链接"
              />
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '创建中...' : '创建新闻'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/news')}
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>

  )
}