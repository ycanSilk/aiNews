'use client'

import { useState, useEffect } from 'react'

interface News {
  _id: string
  semanticId: string
  title: {
    zh: string
    en: string
  }
  summary: {
    zh: string
    en: string
  }
  content?: {
    zh: string
    en: string
  }
  category: string
  author: string
  views: number
  readTime: number
  imageUrl: string
  slug: string
  publishedAt: string
  publishTime: string
  date: string
  weekday: string
  comments: number
  isHot: boolean
  isImportant: boolean
  isCritical: boolean
  tags: string[]
  locales: {
    zh: {
      title: string
      summary: string
      tags: string[]
    }
    en: {
      title: string
      summary: string
      tags: string[]
    }
  }
  externalUrl?: string
  status: string
  createdAt: string
  updatedAt: string
}

interface EditNewsData {
  id: string
  semanticId: string
  title: {
    zh: string
    en: string
  }
  summary: {
    zh: string
    en: string
  }
  content?: {
    zh: string
    en: string
  }
  category: string
  tags: string[]
  author: string
  views: number
  readTime: number
  imageUrl: string
  slug: string
  publishedAt: string
  externalUrl?: string
  isBreaking: boolean
  isImportant: boolean
  isCritical: boolean
  status: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [hoveredCell, setHoveredCell] = useState<{content: string, x: number, y: number} | null>(null)
  const [error, setError] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<EditNewsData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadNews()
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        // 提取分类名称（优先使用中文名称，如果没有则使用英文名称）
        const categoryNames = data.map((category: any) => 
          category.name?.zh || category.name?.en || category.value || ''
        ).filter((name: string) => name.trim() !== '')
        setCategories(categoryNames)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const loadNews = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('正在加载新闻数据...')
      
      // 首先尝试从API加载
      try {
        const response = await fetch('/api/news')
        
        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('新闻数据加载成功:', result.data?.length)
        
        if (result.success) {
          setNews(result.data)
          return
        } else {
          throw new Error(result.error || 'API返回数据格式错误')
        }
      } catch (apiError) {
        console.warn('API加载失败，尝试从本地JSON文件加载:', apiError)
        setError('API连接失败，使用演示数据')
      }
      
      // 如果API加载失败，尝试从本地JSON文件加载
      try {
        // 模拟从本地JSON文件加载数据
        const mockNewsData = [
          {
            _id: "68b1b62cef317d108cc84e0d",
            semanticId: "openai-gpt-20250829-001",
            title: {
              zh: "OpenAI发布GPT-5预览版，性能提升50%",
              en: "OpenAI Releases GPT-5 Preview with 50% Performance Improvement"
            },
            summary: {
              zh: "OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。据内部测试显示，GPT-5在各项基准测试中的表现比GPT-4提升了约50%。",
              en: "OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation. Internal tests show that GPT-5's performance in various benchmarks is approximately 50% better than GPT-4."
            },
            category: "大语言模型",
            readTime: 3,
            publishTime: "2025-08-29T10:13:25.329Z",
            date: "2025-08-29",
            weekday: "Thursday",
            views: 1250,
            comments: 45,
            isBreaking: true,
            isImportant: false,
            tags: ["OpenAI", "GPT-5", "大语言模型"],
            locales: {
              zh: {
                title: "OpenAI发布GPT-5预览版，性能提升50%",
                summary: "OpenAI在今日发布了GPT-5的预览版本，新模型在推理能力、创意写作和代码生成方面都有显著提升。据内部测试显示，GPT-5在各项基准测试中的表现比GPT-4提升了约50%。",
                tags: ["OpenAI", "GPT-5", "大语言模型"]
              },
              en: {
                title: "OpenAI Releases GPT-5 Preview with 50% Performance Improvement",
                summary: "OpenAI today released a preview version of GPT-5, with significant improvements in reasoning, creative writing, and code generation. Internal tests show that GPT-5's performance in various benchmarks is approximately 50% better than GPT-4.",
                tags: []
              }
            },
            status: "published",
            createdAt: "2025-08-29T10:13:25.329Z",
            updatedAt: "2025-08-29T10:13:25.329Z"
          }
        ]
        setNews(mockNewsData)
      } catch (jsonError) {
        console.error('本地JSON数据加载失败:', jsonError)
        setError('数据加载失败，请检查网络连接或API服务')
      }
    } catch (error) {
      console.error('加载新闻失败:', error)
      setError(error instanceof Error ? error.message : '未知错误')
    } finally {
      setLoading(false)
    }
  }

  // 分页计算
  const totalPages = Math.ceil(news.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNews = news.slice(startIndex, endIndex)

  const handleMouseEnter = (e: React.MouseEvent, content: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHoveredCell({
      content,
      x: rect.left + rect.width / 2,
      y: rect.bottom + 5
    })
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
  }

  const handleImportFromJSON = async () => {
    try {
      // 创建隐藏的文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        
        try {
          const text = await file.text()
          const jsonData = JSON.parse(text)
          
          // 验证JSON结构
          if (Array.isArray(jsonData)) {
            // 转换数据格式以匹配News接口
            const importedNews = jsonData.map((item: any) => ({
              _id: item._id?.$oid || item._id || Math.random().toString(36).substr(2, 9),
              semanticId: item.semanticId || '',
              title: item.title || { zh: '', en: '' },
              summary: item.summary || { zh: '', en: '' },
              content: typeof item.content === 'string' ? { zh: item.content, en: '' } : item.content || { zh: '', en: '' },
              category: item.category || '',
              readTime: item.readTime || 0,
              publishTime: item.publishTime || new Date().toISOString(),
              date: item.date || new Date().toISOString().split('T')[0],
              weekday: item.weekday || '',
              views: item.views || 0,
              comments: item.comments || 0,
              isBreaking: item.isBreaking || false,
              isImportant: item.isImportant || false,
              tags: Array.isArray(item.tags) ? item.tags : [],
              locales: item.locales || { zh: { title: '', summary: '', tags: [] }, en: { title: '', summary: '', tags: [] } },
              status: 'published',
              createdAt: item.createdAt || new Date().toISOString(),
              updatedAt: item.updatedAt || new Date().toISOString(),
              author: item.author || ''
            }))
            
            setNews(importedNews)
            alert(`成功导入 ${importedNews.length} 条新闻数据`)
          } else {
            alert('JSON文件格式不正确，应该是一个数组')
          }
        } catch (error) {
          console.error('JSON解析失败:', error)
          alert('JSON文件解析失败，请检查文件格式')
        }
      }
      
      input.click()
    } catch (error) {
      console.error('导入JSON失败:', error)
      alert('导入失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条新闻吗？')) return
    
    try {
      console.log('正在删除新闻:', id)
      const response = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE'
      })
      
      console.log('删除响应状态:', response.status)
      const result = await response.json()
      console.log('删除响应数据:', result)
      
      if (result.success) {
        alert('删除成功')
        await loadNews()
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除新闻失败:', error)
      alert('删除失败，请查看控制台日志')
    }
  }

  const handleEdit = (newsItem: News) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    setEditingNews({
        id: newsItem._id,
        semanticId: newsItem.semanticId || '',
        title: { ...newsItem.title },
        summary: { ...newsItem.summary },
        content: typeof newsItem.content === 'string' ? { zh: newsItem.content, en: '' } : { zh: newsItem.content?.zh || '', en: newsItem.content?.en || '' },
        category: newsItem.category || '',
        tags: newsItem.tags || [],
        author: newsItem.author || currentUser.username || '',
        views: newsItem.views || 0,
        readTime: newsItem.readTime || 0,
        imageUrl: newsItem.imageUrl || '',
        slug: newsItem.slug || '',
        publishedAt: newsItem.publishedAt || newsItem.publishTime || new Date().toISOString(),
        externalUrl: newsItem.externalUrl || '',
        isHot: newsItem.isHot || false,
        isImportant: newsItem.isImportant || false,
        isCritical: newsItem.isCritical || false,
        status: newsItem.status || 'draft'
      })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingNews) return
    
    try {
      setIsSubmitting(true)
      
      // 区分创建新新闻和编辑现有新闻
      const isCreating = !editingNews.id
      const url = isCreating ? '/api/news' : `/api/news`
      const method = isCreating ? 'POST' : 'PUT'
      const currentTime = new Date().toISOString()
      
      console.log(isCreating ? '正在创建新闻' : '正在更新新闻:', editingNews.id)
      
      const requestBody = isCreating ? {
        semanticId: editingNews.semanticId || '',
        title: editingNews.title,
        summary: editingNews.summary,
        content: editingNews.content || { zh: '', en: '' },
        category: editingNews.category || '',
        tags: editingNews.tags || [],
        author: editingNews.author || '',
        views: editingNews.views || 0,
        imageUrl: editingNews.imageUrl || '',
        slug: editingNews.slug || '',
        publishedAt: editingNews.publishedAt || currentTime,
        externalUrl: editingNews.externalUrl || '',
        isHot: editingNews.isHot || false,
        isImportant: editingNews.isImportant || false,
        isCritical: editingNews.isCritical || false,
        status: editingNews.status || 'draft',
        createdAt: currentTime,
        updatedAt: currentTime
      } : {
        id: editingNews.id,
        semanticId: editingNews.semanticId || '',
        title: editingNews.title,
        summary: editingNews.summary,
        content: editingNews.content || { zh: '', en: '' },
        category: editingNews.category || '',
        tags: editingNews.tags || [],
        author: editingNews.author || '',
        views: editingNews.views || 0,
        imageUrl: editingNews.imageUrl || '',
        slug: editingNews.slug || '',
        publishedAt: editingNews.publishedAt || currentTime,
        externalUrl: editingNews.externalUrl || '',
        isBreaking: editingNews.isBreaking || false,
        isImportant: editingNews.isImportant || false,
        isCritical: editingNews.isCritical || false,
        status: editingNews.status || 'draft',
        updatedAt: currentTime
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('响应状态:', response.status)
      const result = await response.json()
      console.log('响应数据:', result)

      if (response.ok) {
        alert(isCreating ? '新闻创建成功！' : '新闻更新成功！')
        setIsEditModalOpen(false)
        setEditingNews(null)
        await loadNews()
      } else {
        alert(`${isCreating ? '创建' : '更新'}失败: ${result.error}`)
      }
    } catch (error) {
      console.error(`${isCreating ? '创建' : '更新'}新闻失败:`, error)
      alert(`${isCreating ? '创建' : '更新'}新闻时发生错误，请查看控制台日志`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">新闻管理</h1>
        <div className="flex space-x-4">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={handleImportFromJSON}
          >
            从JSON导入
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => {
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
              const currentTime = new Date().toISOString()
              const semanticId = `news-${Date.now()}`
              const slug = `news-${Date.now()}`
              
              setEditingNews({
                id: '',
                semanticId: semanticId,
                title: { zh: '', en: '' },
                summary: { zh: '', en: '' },
                content: { zh: '', en: '' },
                category: '',
                tags: [],
                author: currentUser.username || 'admin',
                views: 0,
                readTime: 0,
                imageUrl: '',
                slug: slug,
                publishedAt: currentTime,
                externalUrl: '',
                isHot: false,
                isImportant: false,
                isCritical: false,
                status: 'draft'
              })
              setIsEditModalOpen(true)
            }}
          >
            添加新闻
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="搜索新闻..."
              className="w-80 px-3 py-2 border rounded-md"
            />
            <select className="px-3 py-2 border rounded-md">
              <option>所有分类</option>
            </select>
            <select className="px-3 py-2 border rounded-md">
              <option>所有状态</option>
              <option>已发布</option>
              <option>草稿</option>
            </select>
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-8">暂无数据</div>
          ) : (
            <>
              {/* 分页控制 */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">每页显示:</span>
                  <select 
                    className="px-2 py-1 border rounded text-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                  >
                    <option value={10}>10条</option>
                    <option value={20}>20条</option>
                    <option value={30}>30条</option>
                    <option value={50}>50条</option>
                    <option value={100}>100条</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    第 {startIndex + 1}-{Math.min(endIndex, news.length)} 条，共 {news.length} 条
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    上一页
                  </button>
                  
                  <div className="flex space-x-1">
                    {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                      if (page > totalPages) return null
                      return (
                        <button
                          key={page}
                          className={`px-2 py-1 border rounded text-sm min-w-[2rem] ${
                            currentPage === page 
                              ? 'bg-blue-500 text-white border-blue-500' 
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    下一页
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto flex">
              <table className=" border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">ID</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">语义ID</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">标题</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">摘要</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">分类</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">作者</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">浏览量</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">阅读时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">发布时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">创建时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">更新时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">热门新闻</th>
                     <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">推荐新闻</th>
                     <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">重要新闻</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">标签</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">状态</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentNews.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item._id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item._id}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.semanticId)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.semanticId}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, `${item.title?.zh || ''}\n${item.title?.en || ''}`)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-gray-900">中文: {item.title?.zh}</div>
                          <div className="text-sm text-gray-600 border-t pt-1">英文: {item.title?.en}</div>
                        </div>
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.category || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.category}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.author || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.author}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.views?.toString() || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.views}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.readTime?.toString() || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.readTime}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.publishedAt || item.publishTime || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.publishedAt || item.publishTime}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.createdAt || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.createdAt}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.updatedAt || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.updatedAt}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.comments?.toString() || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.comments}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.isBreaking ? '是' : '否')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.isBreaking ? '是' : '否'}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.isImportant ? '是' : '否')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.isImportant ? '是' : '否'}
                      </td>
                      <td 
                         className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                         onMouseEnter={(e) => handleMouseEnter(e, item.isCritical ? '重要新闻' : '普通新闻')}
                         onMouseLeave={handleMouseLeave}
                       >
                         {item.isCritical ? '✅' : '❌'}
                       </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="space-y-1">
                          <div className="text-gray-900">中文: {item.summary?.zh}</div>
                          <div className="text-sm text-gray-600 border-t pt-1">英文: {item.summary?.en}</div>
                        </div>
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {(Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '')}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.status === 'published' ? '已发布' : '草稿')}
                        onMouseLeave={handleMouseLeave}
                      >
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'published' ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                            onClick={() => handleEdit(item)}
                          >
                            编辑
                          </button>
                          <button 
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            onClick={() => handleDelete(item._id)}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 模态框 */}
            {hoveredCell && (
              <div 
                className="fixed z-50 bg-white border border-gray-300 rounded shadow-lg p-3 max-w-sm break-words"
                style={{
                  left: `${hoveredCell.x}px`,
                  top: `${hoveredCell.y}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-sm">{hoveredCell.content}</div>
              </div>
            )}
          </>
          )}
        </div>
      </div>
      
      {/* 编辑模态框 */}
      {isEditModalOpen && editingNews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingNews.id ? '编辑新闻' : '添加新闻'}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">中文标题</label>
                <input
                  type="text"
                  value={editingNews.title.zh}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    title: { ...editingNews.title, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">英文标题</label>
                <input
                  type="text"
                  value={editingNews.title.en}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    title: { ...editingNews.title, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">中文摘要</label>
                <textarea
                  value={editingNews.summary.zh}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    summary: { ...editingNews.summary, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">英文摘要</label>
                <textarea
                  value={editingNews.summary.en}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    summary: { ...editingNews.summary, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">详细内容</label>
                <textarea
                  value={editingNews.content?.zh || ''}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    content: { ...editingNews.content, zh: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={6}
                  placeholder="请输入中文新闻内容"
                />
                 <label className="block text-sm font-medium mb-1">英文详细内容</label>
                <textarea
                  value={editingNews.content?.en || ''}
                  onChange={(e) => setEditingNews({
                    ...editingNews,
                    content: { ...editingNews.content, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md mt-2"
                  rows={6}
                  placeholder="请输入英文新闻内容"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">分类</label>
                <select
                   value={editingNews.category || ''}
                   onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                   className="w-full px-3 py-2 border rounded-md"
                 >
                   <option value="">选择分类</option>
                   {categories.map((category) => (
                     <option key={category} value={category}>
                       {category}
                     </option>
                   ))}
                 </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">标签</label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]">
                  {editingNews.tags?.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = editingNews.tags.filter((_, i) => i !== index)
                          setEditingNews({ ...editingNews, tags: newTags })
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="输入标签后按回车"
                    className="flex-1 outline-none min-w-[120px] px-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault()
                        const newTag = e.currentTarget.value.trim()
                        const newTags = [...(editingNews.tags || []), newTag]
                        setEditingNews({ ...editingNews, tags: newTags })
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">语义ID</label>
                <input
                  type="text"
                  value={editingNews.semanticId || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, semanticId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入语义ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">作者</label>
                <input
                  type="text"
                  value={editingNews.author || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, author: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入作者名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">浏览量</label>
                <input
                  type="number"
                  value={editingNews.views || 0}
                  onChange={(e) => setEditingNews({ ...editingNews, views: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-md"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">图片URL</label>
                <input
                  type="url"
                  value={editingNews.imageUrl || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入图片URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={editingNews.slug || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入URL友好的标识符"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">发布时间</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingNews.publishedAt || ''}
                    onChange={(e) => setEditingNews({ 
                      ...editingNews, 
                      publishedAt: e.target.value
                    })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="输入日期时间 (YYYY-MM-DDTHH:MM:SS)"
                  />
                  <input
                    type="datetime-local"
                    value={editingNews.publishedAt ? new Date(editingNews.publishedAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditingNews({ 
                      ...editingNews, 
                      publishedAt: e.target.value ? new Date(e.target.value).toISOString() : '' 
                    })}
                    className="w-32 px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">外部跳转URL</label>
                <input
                  type="url"
                  value={editingNews.externalUrl || ''}
                  onChange={(e) => setEditingNews({ ...editingNews, externalUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="请输入外部跳转URL（可选）"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">状态</label>
                <select
                  value={editingNews.status || 'draft'}
                  onChange={(e) => setEditingNews({ ...editingNews, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="draft">草稿</option>
                  <option value="published">已发布</option>
                  <option value="archived">已归档</option>
                </select>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingNews.isHot || false}
                    onChange={(e) => setEditingNews({ ...editingNews, isHot: e.target.checked })}
                    className="mr-2"
                  />
                  热门新闻
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingNews.isImportant || false}
                    onChange={(e) => setEditingNews({ ...editingNews, isImportant: e.target.checked })}
                    className="mr-2"
                  />
                  推荐新闻
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingNews.isCritical || false}
                    onChange={(e) => setEditingNews({ ...editingNews, isCritical: e.target.checked })}
                    className="mr-2"
                  />
                  重要新闻
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingNews(null)
                }}
                disabled={isSubmitting}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSaveEdit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (editingNews.id ? '保存中...' : '创建中...') : (editingNews.id ? '保存' : '创建')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 错误提示 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button 
              className="ml-4 text-red-800 hover:text-red-600"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* 加载状态优化 */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中，请稍候...</p>
          </div>
        </div>
      )}
      </div>
  )
}