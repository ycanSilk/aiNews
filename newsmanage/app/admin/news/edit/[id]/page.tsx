'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface News {
  _id: string
  title: string
  content: string
  category: string
  status: string
}

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [news, setNews] = useState<News>({
    _id: '',
    title: '',
    content: '',
    category: '',
    status: 'draft'
  })

  useEffect(() => {
    if (params.id) {
      loadNews(params.id as string)
    }
  }, [params.id])

  const loadNews = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/news?id=${id}`)
      const result = await response.json()
      
      if (result.success) {
        setNews(result.data)
      }
    } catch (error) {
      console.error('加载新闻失败:', error)
      alert('加载新闻失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!news.title.trim() || !news.content.trim()) {
      alert('标题和内容不能为空')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/news?id=${news._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(news)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('保存成功')
        router.push('/admin/news')
      } else {
        alert('保存失败: ' + result.error)
      }
    } catch (error) {
      console.error('保存失败:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof News, value: string) => {
    setNews(prev => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">加载中...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">编辑新闻</h1>
        <button 
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          onClick={() => router.push('/admin/news')}
        >
          返回列表
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">标题</label>
          <input
            type="text"
            value={news.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">内容</label>
          <textarea
            value={news.content}
            onChange={(e) => handleChange('content', e.target.value)}
            className="w-full p-2 border rounded-md h-32"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">分类</label>
          <input
            type="text"
            value={news.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">状态</label>
          <select
            value={news.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}