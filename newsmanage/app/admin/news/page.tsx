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
  category: string
  readTime: number
  publishTime: string
  date: string
  weekday: string
  views: number
  comments: number
  isBreaking: boolean
  isImportant: boolean
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
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [hoveredCell, setHoveredCell] = useState<{content: string, x: number, y: number} | null>(null)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    try {
      setLoading(true)
      // 首先尝试从API加载
      try {
        const response = await fetch('/api/news')
        const result = await response.json()
        
        if (result.success) {
          setNews(result.data)
          return
        }
      } catch (apiError) {
        console.warn('API加载失败，尝试从本地JSON文件加载:', apiError)
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
      }
    } catch (error) {
      console.error('加载新闻失败:', error)
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
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
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
      const response = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        alert('删除成功')
        loadNews()
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除新闻失败:', error)
      alert('删除失败')
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
            onClick={() => window.location.href = '/admin/news/create'}
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
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">中文标题</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">英文标题</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">分类</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">阅读时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">发布时间</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">浏览量</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">评论数</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">紧急新闻</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">重要新闻</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">中文摘要</th>
                    <th className="border border-gray-300 p-2 text-center 0 overflow-hidden text-ellipsis whitespace-nowrap">英文摘要</th>
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
                        onMouseEnter={(e) => handleMouseEnter(e, item.title?.zh || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.title?.zh}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.title?.en || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.title?.en}
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
                        onMouseEnter={(e) => handleMouseEnter(e, item.readTime?.toString() || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.readTime}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.publishTime || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.publishTime}
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
                        onMouseEnter={(e) => handleMouseEnter(e, item.summary?.zh || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.summary?.zh}
                      </td>
                      <td 
                        className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap relative group"
                        onMouseEnter={(e) => handleMouseEnter(e, item.summary?.en || '')}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.summary?.en}
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
                            onClick={() => window.location.href = `/admin/news/edit/${item._id}`}
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
      </div>
  )
}