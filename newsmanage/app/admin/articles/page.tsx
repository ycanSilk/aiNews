'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Article {
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
  author: {
    _id: string
    username: string
    email: string
  }
  views: number
  readTime: number
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
  createdAt: string
  updatedAt: string
}

interface EditArticleData {
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
  author: {
    _id: string
    username: string
    email: string
  }
  views: number
  readTime: number
  slug: string
  publishedAt: string
  externalUrl?: string
  isBreaking: boolean
  isImportant: boolean
  isCritical: boolean
}

export default function AdminNewsPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [hoveredCell, setHoveredCell] = useState<{content: string, x: number, y: number} | null>(null)
  const [error, setError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<{displayName: string, value: string}[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [statusOptions, setStatusOptions] = useState<string[]>(['published', 'draft'])
  const [tempSearchKeyword, setTempSearchKeyword] = useState('') // 临时搜索关键词
  const [tempSelectedCategory, setTempSelectedCategory] = useState('') // 临时选中分类
  const [tempSelectedStatus, setTempSelectedStatus] = useState('') // 临时选中状态

  // 字段映射配置 - 字段名到中文标签的映射
  const fieldMappings = {
    _id: 'ID',
    semanticId: '语义ID',
    title: '标题',
    summary: '摘要',
    content: '内容',
    category: '分类',
    author: '作者',
    views: '浏览量',
    slug: 'Slug',
    publishedAt: '发布时间',
    tags: '标签',
    createdAt: '创建时间',
    updatedAt: '更新时间'
  }

  // 获取动态字段列表（排除不需要显示的字段）
  const getDynamicFields = () => {
    const excludeFields = ['_id', 'locales', 'publishTime', 'date', 'weekday']
    return Object.keys(fieldMappings).filter(field => !excludeFields.includes(field))
  }

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // 格式化布尔值显示
  const formatBoolean = (value: boolean) => {
    return value ? '✅' : '❌'
  }

  // 格式化日期时间用于datetime-local输入框
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ''
    }
  }

  useEffect(() => {
    loadArticles()
    loadCategories()
    loadStatusOptions()
  }, [searchKeyword, selectedCategory, selectedStatus, currentPage])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        console.log('原始分类数据:', data)
        
        // 检查分类数据结构
        if (data.length > 0) {
          const firstCategory = data[0]
          console.log('第一个分类的完整结构:', firstCategory)
          console.log('分类字段:', Object.keys(firstCategory))
          
          // 检查新闻数据中的分类字段
          if (articles.length > 0) {
            const firstArticle = articles[0]
            console.log('第一个文章的分类字段:', firstArticle.category)
            console.log('文章分类字段类型:', typeof firstArticle.category)
          }
        }
        
        // 提取分类数据，包含显示名称和匹配值
        const categoryData = data.map((category: any) => ({
          displayName: category.name?.zh || category.name?.en || category.value || '',
          value: category.value || ''
        })).filter((cat: any) => cat.displayName.trim() !== '' && cat.value.trim() !== '')
        
        console.log('处理后的分类数据:', categoryData)
        setCategories(categoryData)
      }
    } catch (error) {
      console.error('获取分类失败:', error)
    }
  }

  const loadStatusOptions = async () => {
    try {
      // 从文章数据中提取所有唯一的状态值
      const response = await fetch('/api/articles')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const statusSet = new Set<string>()
          result.data.forEach((item: Article) => {
            if (item.status) {
              statusSet.add(item.status)
            }
          })
          // 确保包含默认状态
          statusSet.add('published')
          statusSet.add('draft')
          setStatusOptions(Array.from(statusSet))
        }
      }
    } catch (error) {
      console.error('获取状态选项失败:', error)
      // 使用默认状态选项
      setStatusOptions(['published', 'draft'])
    }
  }

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError('')
      
      // 构建查询参数
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchKeyword) {
        params.append('search', searchKeyword)
      }
      
      if (selectedCategory) {
        params.append('category', selectedCategory)
      }
      
      if (selectedStatus) {
        params.append('status', selectedStatus)
      }
      
      // 从MongoDB API获取数据
      const response = await fetch(`/api/articles?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        setArticles(result.data)
        setFilteredArticles(result.data)
        setTotalItems(result.pagination.total)
      } else {
        throw new Error(result.error || 'API返回失败')
      }
      
    } catch (error) {
      console.error('加载文章数据失败:', error)
      setError(error instanceof Error ? error.message : '未知错误')
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // 搜索和筛选处理 - 现在由API处理筛选，这里直接使用返回的数据

  // 分页计算 - 基于API返回的总数
   const totalPages = Math.ceil(totalItems / itemsPerPage)
   const startIndex = (currentPage - 1) * itemsPerPage
   const endIndex = startIndex + itemsPerPage
   const currentArticles = articles.slice(startIndex, endIndex)

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

  // 处理查询按钮点击
  const handleSearch = () => {
    console.log('执行搜索:', {
      搜索关键词: tempSearchKeyword,
      选中分类: tempSelectedCategory,
      选中状态: tempSelectedStatus
    })
    
    // 将临时搜索条件应用到实际搜索
    setSearchKeyword(tempSearchKeyword)
    setSelectedCategory(tempSelectedCategory)
    setSelectedStatus(tempSelectedStatus)
    setCurrentPage(1)
    
    // 重新加载数据
    loadArticles()
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
          
          // 验证数据格式
          if (!Array.isArray(jsonData)) {
            throw new Error('JSON文件必须包含数组数据')
          }
          
          // 格式化数据
          const formattedData = jsonData.map((item: any) => ({
            ...item,
            _id: item._id || `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: item.status || 'draft'
          }))
          
          setArticles(formattedData)
          setFilteredArticles(formattedData)
          setError('')
          
        } catch (error) {
          console.error('导入JSON失败:', error)
          setError('导入失败: ' + (error instanceof Error ? error.message : '未知错误'))
        }
      }
      
      input.click()
    } catch (error) {
      console.error('导入功能错误:', error)
      setError('导入功能出错')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    try {
      console.log('=== 开始删除文章 ===')
      console.log('文章ID:', id)
      console.log('请求URL:', `/api/articles/${id}`)
      
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE'
      })
      
      console.log('删除响应状态:', response.status)
      console.log('删除响应头:', Object.fromEntries(response.headers.entries()))
      
      const result = await response.json()
      console.log('删除响应数据:', result)
      
      if (response.ok) {
        console.log('文章删除成功，更新本地状态')
        setArticles(prev => prev.filter(item => item._id !== id))
        setFilteredArticles(prev => prev.filter(item => item._id !== id))
        setError('')
        console.log('本地状态更新完成')
      } else {
        console.error('删除失败，服务器返回错误:', result.error)
        throw new Error(result.error || '删除失败')
      }
    } catch (err) {
      console.error('删除文章错误:', err)
      setError('删除失败，请重试')
    }
  }

  const handleEdit = (article: Article) => {
    router.push(`/admin/articles/edit/${article._id}`)
  }

  // 保存编辑（已弃用，现在使用独立编辑页面）

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <div className="flex space-x-4">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={handleImportFromJSON}
          >
            从JSON导入
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => router.push('/admin/articles/add')}
          >
            添加文章
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="搜索文章..."
              className="w-80 px-3 py-2 border rounded-md"
              value={tempSearchKeyword}
              onChange={(e) => setTempSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={handleSearch}
            >
              查询
            </button>
            <select 
              className="px-3 py-2 border rounded-md"
              value={tempSelectedCategory}
              onChange={(e) => {
                setTempSelectedCategory(e.target.value)
                console.log('临时选中分类:', e.target.value)
              }}
            >
              <option value="">所有分类</option>
              {categories.map((category, index) => (
                <option key={index} value={category.value}>
                  {category.displayName}
                </option>
              ))}
            </select>
            <select 
              className="px-3 py-2 border rounded-md"
              value={tempSelectedStatus}
              onChange={(e) => {
                setTempSelectedStatus(e.target.value)
                console.log('临时选中状态:', e.target.value)
              }}
            >
              <option value="">所有状态</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'published' ? '已发布' : 
                   status === 'draft' ? '草稿' : 
                   status}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : articles.length === 0 ? (
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
                    第 {startIndex + 1}-{Math.min(endIndex, totalItems)} 条，共 {totalItems} 条
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
                    {getDynamicFields().map((field) => (
                      <th key={field} className="border border-gray-300 p-2 text-center max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                        {fieldMappings[field as keyof typeof fieldMappings]}
                      </th>
                    ))}
                    <th className="border border-gray-300 p-2 text-center max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArticles.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      {getDynamicFields().map((field) => {
                        const value = item[field as keyof Article]
                        let displayValue: React.ReactNode = ''
                        
                        // 处理不同类型的字段显示
                        if (field === 'title' || field === 'summary' || field === 'content') {
                          // 多语言对象字段
                          const multiLangValue = value as { zh: string; en: string }
                          displayValue = (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-900">中文: {multiLangValue?.zh || ''}</div>
                              <div className="text-sm text-gray-600 border-t pt-1">英文: {multiLangValue?.en || ''}</div>
                            </div>
                          )
                        } else if (field === 'publishedAt' || field === 'createdAt' || field === 'updatedAt') {
                          // 日期字段
                          displayValue = formatDate(value as string)
                        } else if (field === 'isHot' || field === 'isImportant' || field === 'isCritical' || field === 'featured') {
                          // 布尔值字段
                          displayValue = formatBoolean(value as boolean)
                        } else if (field === 'tags') {
                          // 标签数组 - 处理ObjectId或对象格式
                          if (Array.isArray(value)) {
                            if (value.length > 0 && typeof value[0] === 'object' && 'name' in value[0]) {
                              // 如果是填充后的标签对象数组
                              displayValue = value.map((tag: any) => tag.name?.zh || tag.name?.en || tag.value || '').join(', ')
                            } else {
                              // 如果是ObjectId字符串数组或其他格式
                              displayValue = value.join(', ')
                            }
                          } else {
                            displayValue = value || ''
                          }
                        } else if (field === 'category') {
                          // 分类字段 - 处理ObjectId或对象格式
                          if (value && typeof value === 'object' && 'name' in value) {
                            // 如果是填充后的分类对象
                            displayValue = (value as any).name?.zh || (value as any).name?.en || (value as any).value || ''
                          } else {
                            // 如果是ObjectId字符串
                            displayValue = value || ''
                          }
                        } else if (field === 'author') {
                          // 作者字段 - 处理ObjectId或对象格式
                          if (value && typeof value === 'object' && 'username' in value) {
                            // 如果是填充后的作者对象
                            displayValue = (value as any).username || (value as any).name || ''
                          } else {
                            // 如果是ObjectId字符串
                            displayValue = value || ''
                          }
                        } else if (field === 'status') {
                          // 状态字段
                          const statusValue = value as string
                          displayValue = (
                            <span className={`px-2 py-1 rounded text-xs ${
                              statusValue === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {statusValue === 'published' ? '已发布' : '草稿'}
                            </span>
                          )
                        } else {
                          // 其他字段直接显示
                          displayValue = value !== null && value !== undefined ? String(value) : ''
                        }
                        
                        return (
                          <td 
                            key={field}
                            className="border border-gray-300 p-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap relative group"
                            onMouseEnter={(e) => handleMouseEnter(e, typeof value === 'object' ? JSON.stringify(value) : String(value || ''))}
                            onMouseLeave={handleMouseLeave}
                          >
                            {displayValue}
                          </td>
                        )
                      })}
                      <td className="border border-gray-300 p-2 0 overflow-hidden text-ellipsis whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors mr-2"
                            onClick={() => handleEdit(item)}
                          >
                            快速编辑
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
      
      {/* 编辑模态框（已弃用，现在使用独立编辑页面） */}
      
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