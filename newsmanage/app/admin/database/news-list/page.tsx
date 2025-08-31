'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  _id: string
  title: {
    zh: string
    en: string
  }
  summary: {
    zh: string
    en: string
  }
  content: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  author: string
  views: number
  featured: boolean
  imageUrl?: string
  slug: string
  createdAt: string
  updatedAt: string
  __v: number
}

export default function NewsListPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Loading news...')
      const response = await fetch('/api/news')
      
      if (!response.ok) {
        throw new Error(`Failed to load news: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('News loaded:', result.data.length)
      setNews(result.data)
    } catch (err) {
      console.error('Error loading news:', err)
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNews = async (newsId: string, newsTitle: string) => {
    console.log('=== DELETE NEWS CLICKED ===')
    console.log('News ID:', newsId)
    console.log('News Title:', newsTitle)
    
    if (!confirm(`确定要删除新闻 "${newsTitle}" 吗？此操作不可撤销。`)) {
      console.log('Delete operation cancelled by user')
      return
    }

    try {
      console.log('Sending DELETE request to API...')
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('DELETE response status:', response.status)
      const result = await response.json()
      console.log('DELETE response data:', result)

      if (response.ok) {
        console.log('News deleted successfully, reloading news...')
        await loadNews()
        console.log('News reloaded successfully')
      } else {
        console.error('Failed to delete news:', result.error)
        alert(`删除失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('删除新闻时发生错误，请查看控制台日志')
    }
  }

  const handleEditNews = async (newsId: string) => {
    console.log('=== EDIT NEWS CLICKED ===')
    console.log('News ID:', newsId)
    
    // 查找要编辑的新闻
    const newsToEdit = news.find(item => item._id === newsId)
    if (!newsToEdit) {
      console.error('News not found for editing:', newsId)
      alert('找不到要编辑的新闻')
      return
    }

    console.log('News to edit:', newsToEdit)
    
    // 这里可以打开一个模态框或表单来编辑新闻信息
    // 暂时使用简单的prompt来演示
    const newTitleZh = prompt('请输入中文标题:', newsToEdit.title.zh)
    if (newTitleZh === null) {
      console.log('Edit operation cancelled by user')
      return
    }

    const newTitleEn = prompt('请输入英文标题:', newsToEdit.title.en)
    const newSummaryZh = prompt('请输入中文摘要:', newsToEdit.summary.zh)
    const newSummaryEn = prompt('请输入英文摘要:', newsToEdit.summary.en)

    try {
      console.log('Sending PUT request to update news...')
      const response = await fetch(`/api/news`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: newsId,
          title: {
            zh: newTitleZh || '',
            en: newTitleEn || ''
          },
          summary: {
            zh: newSummaryZh || '',
            en: newSummaryEn || ''
          }
        })
      })

      console.log('PUT response status:', response.status)
      const result = await response.json()
      console.log('PUT response data:', result)

      if (response.ok) {
        console.log('News updated successfully, reloading news...')
        alert('新闻更新成功！')
        await loadNews()
        console.log('News reloaded successfully')
      } else {
        console.error('Failed to update news:', result.error)
        alert(`更新失败: ${result.error}`)
      }
    } catch (error) {
      console.error('Error updating news:', error)
      alert('更新新闻时发生错误，请查看控制台日志')
    }
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content || content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
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
            onClick={loadNews}
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
        <h1 className="text-2xl font-bold text-gray-800">新闻列表管理</h1>
        <p className="text-gray-600 mt-2">管理系统新闻数据列表</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            新闻列表 ({news.length})
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            添加新闻
          </button>
        </div>
        
        {news.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            暂无新闻数据
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">新闻标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">摘要</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容预览</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((newsItem) => (
                  <tr key={newsItem._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {newsItem.title.zh}
                      {newsItem.title.en && (
                        <div className="text-xs text-gray-400">{newsItem.title.en}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {newsItem.summary.zh}
                      {newsItem.summary.en && (
                        <div className="text-xs text-gray-400">{newsItem.summary.en}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">
                        {truncateContent(newsItem.content)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {newsItem.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        newsItem.status === 'published' ? 'bg-green-100 text-green-800' :
                        newsItem.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {newsItem.status === 'published' ? '已发布' :
                         newsItem.status === 'draft' ? '草稿' : '已归档'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditNews(newsItem._id)}
                      >
                        编辑
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteNews(newsItem._id, newsItem.title.zh || newsItem.title.en || '未命名新闻')}
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