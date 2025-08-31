'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'

interface NewsItem {
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
  [key: string]: any
}

interface FieldOperation {
  type: 'add' | 'remove' | 'rename'
  fieldName: string
  newFieldName?: string
  fieldType?: string
  fieldValue?: any
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([])
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState('string')
  const [newFieldValue, setNewFieldValue] = useState('')
  
  // 字段配置映射
  const fieldConfig: Record<string, string> = {
    _id: 'string',
    semanticId: 'string',
    title: 'object',
    summary: 'object',
    category: 'string',
    readTime: 'number',
    publishTime: 'string',
    date: 'string',
    weekday: 'string',
    views: 'number',
    comments: 'number',
    isBreaking: 'boolean',
    isImportant: 'boolean',
    tags: 'array',
    locales: 'object'
  }

  // 字段注释映射
  const [fieldComments, setFieldComments] = useState<Record<string, string>>({
    _id: '新闻唯一标识符',
    semanticId: '语义化ID，用于URL和标识',
    title: '新闻标题（中英文）',
    summary: '新闻摘要（中英文）',
    category: '新闻分类',
    readTime: '阅读时长（分钟）',
    publishTime: '发布时间',
    date: '发布日期',
    weekday: '星期几',
    views: '浏览量',
    comments: '评论数',
    isBreaking: '是否突发新闻',
    isImportant: '是否重要新闻',
    tags: '标签数组',
    locales: '多语言本地化数据'
  })

  // 计算字段统计信息
  const getFieldStats = (fieldName: string, fieldType: string) => {
    if (news.length === 0) return '无数据'
    
    const values = news.map(item => item[fieldName])
    
    switch (fieldType) {
      case 'number':
        const numValues = values.filter(v => typeof v === 'number' && !isNaN(v))
        if (numValues.length === 0) return '无有效数字'
        
        const sum = numValues.reduce((a, b) => a + b, 0)
        const avg = sum / numValues.length
        const max = Math.max(...numValues)
        const min = Math.min(...numValues)
        
        return `总数:${sum} 平均:${avg.toFixed(1)} 最大:${max} 最小:${min}`
        
      case 'string':
        const strValues = values.filter(v => typeof v === 'string' && v.trim() !== '')
        if (strValues.length === 0) return '无有效字符串'
        
        const uniqueCount = new Set(strValues).size
        const maxLength = Math.max(...strValues.map(v => v.length))
        const minLength = Math.min(...strValues.map(v => v.length))
        
        return `唯一值:${uniqueCount} 最长:${maxLength} 最短:${minLength}`
        
      case 'boolean':
        const boolValues = values.filter(v => typeof v === 'boolean')
        if (boolValues.length === 0) return '无布尔值'
        
        const trueCount = boolValues.filter(v => v === true).length
        const falseCount = boolValues.filter(v => v === false).length
        
        return `真:${trueCount} 假:${falseCount}`
        
      case 'array':
        const arrValues = values.filter(v => Array.isArray(v))
        if (arrValues.length === 0) return '无数组数据'
        
        const totalItems = arrValues.reduce((sum, arr) => sum + arr.length, 0)
        const avgItems = totalItems / arrValues.length
        const maxItems = Math.max(...arrValues.map(arr => arr.length))
        
        return `总项:${totalItems} 平均:${avgItems.toFixed(1)} 最大:${maxItems}`
        
      default:
        return '复杂类型'
    }
  }
  
  const newsData = news // 使用news数据作为字段统计的基础

  useEffect(() => {
    loadNews()
    loadFieldComments()
  }, [])

  const loadFieldComments = async () => {
    try {
      const response = await fetch('/api/admin/database/news/load-comments')
      const result = await response.json()
      
      if (result.success && result.data) {
        // 合并本地注释数据
        setFieldComments(prev => ({ ...prev, ...result.data }))
      }
    } catch (error) {
      console.error('加载注释数据失败:', error)
    }
  }

  const loadNews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/database/news')
      const result = await response.json()
      
      if (result.success) {
        setNews(result.data.items)
        setFields(result.data.fields)
      } else {
        console.error('加载新闻数据失败:', result.error)
      }
    } catch (error) {
      console.error('加载新闻数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = () => {
    if (!newFieldName.trim()) return
    
    const operation: FieldOperation = {
      type: 'add',
      fieldName: newFieldName.trim(),
      fieldType: newFieldType,
      fieldValue: parseFieldValue(newFieldValue, newFieldType)
    }
    
    setFieldOperations([...fieldOperations, operation])
    setNewFieldName('')
    setNewFieldValue('')
  }

  const handleRemoveField = async (newsItem: NewsItem, fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    if (!confirm(`确定要删除字段 ${fieldName} 吗？`)) return
    
    try {
      const response = await fetch('/api/admin/database/news', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: newsItem._id,
          fieldName
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('字段删除成功')
        await loadNews() // 刷新数据
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除字段失败:', error instanceof Error ? error.message : '未知错误类型')
      alert('删除失败，请重试')
    }
  }

  const handleEditField = async (fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    const newFieldName = prompt(`修改字段名 ${fieldName} 为:`)
    
    if (newFieldName !== null && newFieldName.trim() !== '') {
      try {
        const requestBody = {
          operation: 'rename',
          oldFieldName: fieldName,
          newFieldName: newFieldName.trim()
        }
        
        console.log('修改字段名请求参数:', requestBody)
        
        const response = await fetch('/api/admin/database/news/fields', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })

        console.log('修改字段名响应状态:', response.status, response.statusText)
        
        const result = await response.json()
        console.log('修改字段名响应内容:', result)
        
        if (result.success) {
          alert('字段名修改成功')
          await loadNews() // 刷新数据
        } else {
          alert('修改失败: ' + result.error)
        }
      } catch (error) {
        console.error('修改字段名失败:', error)
        console.error('错误详情:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : '未知错误类型',
          stack: error instanceof Error ? error.stack : '无堆栈信息'
        })
        alert('修改失败，请重试')
      }
    }
  }

  const handleEditComment = async (fieldName: string) => {
    const newComment = prompt(`修改字段 ${fieldName} 的注释 (当前: ${fieldComments[fieldName] || '暂无注释'}):`)
    
    if (newComment !== null) {
      try {
        // 更新本地注释映射
        const updatedComments = { ...fieldComments, [fieldName]: newComment }
        setFieldComments(updatedComments)
        
        console.log('保存注释请求数据:', updatedComments)
        
        // 保存到本地JSON文件
        const response = await fetch('/api/admin/database/news/save-comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedComments)
        })
        
        console.log('保存注释响应状态:', response.status, response.statusText)
        
        const result = await response.json()
        console.log('保存注释响应内容:', result)
        
        if (result.success) {
          alert('注释已保存到本地文件')
        } else {
          alert('注释保存失败: ' + result.error)
        }
      } catch (error) {
        console.error('保存注释失败:', error)
        console.error('错误详情:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : '未知错误类型',
          stack: error instanceof Error ? error.stack : '无堆栈信息'
        })
        alert('注释保存失败，请重试')
      }
    }
  }

  const handleDeleteField = async (fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    if (!confirm(`确定要删除字段 ${fieldName} 吗？此操作将删除所有新闻中的该字段数据！`)) return
    
    try {
      const response = await fetch('/api/admin/database/news/fields', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fieldName: fieldName
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('字段删除成功')
        await loadNews() // 刷新数据
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除字段失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handleEditFieldOld = async (newsItem: NewsItem, fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    const newFieldName = prompt(`修改字段名 ${fieldName} 为:`)
    
    if (newFieldName !== null && newFieldName.trim() !== '') {
      try {
        const response = await fetch('/api/admin/database/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operations: [{
              type: 'rename',
              fieldName: fieldName,
              newFieldName: newFieldName.trim(),
              targetId: newsItem._id
            }]
          })
        })

        const result = await response.json()
        
        if (result.success) {
          alert('字段名修改成功')
          await loadNews() // 刷新数据
        } else {
          alert('修改失败: ' + result.error)
        }
      } catch (error) {
        console.error('修改字段名失败:', error instanceof Error ? error.message : '未知错误类型')
      alert('修改失败，请重试')
      }
    }
  }

  const parseFieldValue = (value: string, type: string): any => {
    switch (type) {
      case 'number':
        return Number(value)
      case 'boolean':
        return value.toLowerCase() === 'true'
      case 'object':
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      case 'array':
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      default:
        return value
    }
  }

  const applyFieldOperations = async () => {
    if (fieldOperations.length === 0) return

    // 检查是否有需要选择新闻的操作
    const hasNonAddOperations = fieldOperations.some(op => op.type !== 'add')
    if (hasNonAddOperations && !selectedNews) {
      alert('请先选择一条新闻')
      return
    }

    try {
      // 对于添加字段操作，不需要选择新闻，直接对整个集合操作
      const operationsWithTargetId = fieldOperations.map(op => ({
        ...op,
        targetId: op.type === 'add' ? '' : selectedNews?._id
      }))

      console.log('=== 前端调试信息 ===')
      console.log('选中的新闻:', selectedNews)
      console.log('待执行操作:', JSON.stringify(operationsWithTargetId, null, 2))
      console.log('请求URL:', '/api/admin/database/news')
      console.log('请求方法: POST')
      console.log('请求体:', JSON.stringify({ operations: operationsWithTargetId }, null, 2))

      const response = await fetch('/api/admin/database/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operations: operationsWithTargetId })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('操作应用成功')
        setFieldOperations([])
        await loadNews() // 刷新数据
        setSelectedNews(null)
      } else {
        alert('操作失败: ' + result.error)
      }
    } catch (error) {
      console.error('应用操作失败:', error instanceof Error ? error.message : '未知错误类型')
      alert('操作失败，请重试')
    }
  }

  const removeOperation = (index: number) => {
    setFieldOperations(fieldOperations.filter((_, i) => i !== index))
  }

  // 新闻删除功能
  const handleDeleteNews = async (newsId: string, title: string) => {
    if (!confirm(`确定要删除新闻"${title}"吗？此操作不可撤销。`)) return
    
    try {
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('新闻删除成功！')
        await loadNews()
      } else {
        alert(`删除失败: ${result.error}`)
      }
    } catch (error) {
      console.error('删除新闻失败:', error)
      alert('删除新闻时发生错误')
    }
  }

  // 新闻编辑功能
  const handleEditNews = async (newsId: string) => {
    const newsToEdit = news.find(item => item._id === newsId)
    if (!newsToEdit) return
    
    // 这里可以打开模态框进行编辑
    alert(`编辑新闻: ${newsToEdit.title.zh}`)
  }

  // 内容截断函数
  const truncateContent = (content: string, maxLength: number = 100) => {
    if (!content || content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </AdminLayout>
    )
  }

  return (

      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">新闻列表管理</h1>
          <p className="text-gray-600 mt-2">管理系统新闻数据列表</p>
        </div>
        
        {/* 新闻列表表格 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              新闻列表 ({news.length})
            </h2>
            <button 
              onClick={() => window.location.href = 'http://localhost:8899/admin/database/news/add'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
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

        {/* 字段管理部分（保留原有功能） */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">字段管理</h2>
          
          {/* 字段管理表单 */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">添加新字段</h3>
            <div className="md:grid md:grid-cols-3 gap-4 mb-4">
              <div className='py-2'>
                <label className="block text-sm font-medium mb-1">字段名</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="输入字段名"
                />
              </div>
              
              <div className='py-2'>
                <label className="block text-sm font-medium mb-1">字段类型</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="string">字符串</option>
                  <option value="number">数字</option>
                  <option value="boolean">布尔值</option>
                  <option value="object">对象</option>
                  <option value="array">数组</option>
                </select>
              </div>
              
              <div className='py-2'>
                <label className="block text-sm font-medium mb-1">字段值</label>
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="输入字段值"
                />
              </div>
            </div>
            
            <button
              onClick={handleAddField}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              添加字段
            </button>
          </div>

          {/* 字段数据表格 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">字段管理 ({fields.length} 个字段)</h3>
              <button
                onClick={loadNews}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                查询刷新
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2 text-left">字段名称</th>
                    <th className="border border-gray-300 p-2 text-left">类型</th>
                    <th className="border border-gray-300 p-2 text-left">作用注释</th>
                    <th className="border border-gray-300 p-2 text-left">统计信息</th>
                    <th className="border border-gray-300 p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((fieldName) => {
                    const fieldType = fieldConfig[fieldName] || 'string'
                    return (
                      <tr key={fieldName} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2 font-medium">
                          {fieldName}
                        </td>
                        <td className="border border-gray-300 p-2 text-gray-600">
                          {fieldType === 'string' && '字符串类型'}
                          {fieldType === 'number' && '数字类型'}
                          {fieldType === 'boolean' && '布尔类型'}
                          {fieldType === 'object' && '对象类型'}
                          {fieldType === 'array' && '数组类型'}
                        </td>
                        <td className="border border-gray-300 p-2 text-gray-600">
                          {fieldComments[fieldName] || '暂无注释'}
                        </td>
                        <td className="border border-gray-300 p-2 text-sm text-gray-600">
                          {getFieldStats(fieldName, fieldType)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditField(fieldName)}
                              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                              修改字段名
                            </button>
                            <button
                              onClick={() => handleEditComment(fieldName)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                            >
                              修改注释
                            </button>
                            <button
                              onClick={() => handleDeleteField(fieldName)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

  )
}