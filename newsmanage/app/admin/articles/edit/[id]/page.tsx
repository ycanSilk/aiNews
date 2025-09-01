'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor'

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

interface EditArticleData {
  _id: string
  title: { zh: string; en: string }
  summary: { zh: string; en: string }
  content?: { zh: string; en: string }
  category: string
  author: string
  imageUrl: string
  slug: string
  publishedAt: string
  publishTime: string
  date: string
  weekday: string
  isHot: boolean
  isImportant: boolean
  isCritical: boolean
  tags: string[]
  externalUrl?: string
  status: string
}

const fieldMappings: Record<string, string> = {
  title: '标题',
  summary: '摘要',
  content: '内容',
  category: '分类',
  author: '作者',
  imageUrl: '图片URL',
  slug: 'Slug',
  publishedAt: '发布时间',
  publishTime: '发布具体时间',
  date: '日期',
  weekday: '星期',
  isHot: '热门',
  isImportant: '重要',
  isCritical: '紧急',
  tags: '标签',
  externalUrl: '外部链接',
  status: '状态'
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export default function ArticleEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [editingArticle, setEditingArticle] = useState<EditArticleData>({
    _id: '',
    title: { zh: '', en: '' },
    summary: { zh: '', en: '' },
    content: { zh: '', en: '' },
    category: '',
    author: '',
    imageUrl: '',
    slug: '',
    publishedAt: '',
    publishTime: '',
    date: '',
    weekday: '',
    isHot: false,
    isImportant: false,
    isCritical: false,
    tags: [],
    status: 'draft'
  })
  
  const [categories, setCategories] = useState<Array<{value: string, displayName: string}>>([])
  const [statusOptions] = useState([
    { value: 'draft', label: '草稿' },
    { value: 'published', label: '已发布' },
    { value: 'archived', label: '已归档' }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadArticleData()
    loadCategories()
  }, [id])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadArticleData = async () => {
    try {
      const response = await fetch(`/api/articles/${id}`)
      if (response.ok) {
        const articleData = await response.json()
        setEditingArticle(articleData)
        setIsLoading(false)
      } else {
        console.error('Failed to load article data')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Error loading article data:', err)
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setError('')
    
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingArticle),
      })
      
      if (response.ok) {
        router.push('/admin/articles')
        router.refresh()
      } else {
        const errorData = await response.json()
        setError(errorData.message || '保存失败')
      }
    } catch (err) {
      setError('保存时发生错误')
      console.error('Error saving article:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/articles')
  }

  const onUpdateArticle = (updatedData: Partial<EditArticleData>) => {
    setEditingArticle(prev => ({ ...prev, ...updatedData }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">编辑文章</h1>
          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* 编辑表单 */}
        <div className="space-y-6">
          {Object.entries(fieldMappings).map(([field, fieldLabel]) => {
            const value = editingArticle[field as keyof EditArticleData]
            
            // 排除不需要显示的字段
            const excludedFields = ['_id', 'views', 'comments', 'createdAt', 'updatedAt', 'readTime']
            if (excludedFields.includes(field)) {
              return null
            }
            
            // 根据字段类型渲染不同的输入组件
            if (field === 'title' || field === 'summary' || field === 'content') {
              // 多语言文本字段
              const multiLangValue = value as { zh: string; en: string } || { zh: '', en: '' }
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel} (中文)</label>
                  {field === 'content' ? (
                    <EnhancedRichTextEditor
                      value={multiLangValue.zh || ''}
                      onChange={(value) => onUpdateArticle({
                        [field]: { ...multiLangValue, zh: value }
                      })}
                      className="w-full"
                      minHeight="400px"
                      placeholder={`请输入中文${fieldLabel}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={multiLangValue.zh || ''}
                      onChange={(e) => onUpdateArticle({
                        [field]: { ...multiLangValue, zh: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                      placeholder={`请输入中文${fieldLabel}`}
                    />
                  )}
                  
                  <label className="block text-lg font-semibold mb-3 mt-6">{fieldLabel} (英文)</label>
                  {field === 'content' ? (
                    <EnhancedRichTextEditor
                      value={multiLangValue.en || ''}
                      onChange={(value) => onUpdateArticle({
                        [field]: { ...multiLangValue, en: value }
                      })}
                      className="w-full"
                      minHeight="400px"
                      placeholder={`请输入英文${fieldLabel}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={multiLangValue.en || ''}
                      onChange={(e) => onUpdateArticle({
                        [field]: { ...multiLangValue, en: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                      placeholder={`请输入英文${fieldLabel}`}
                    />
                  )}
                </div>
              )
            } else if (field === 'category') {
              // 分类选择框
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  <select
                    value={value as string || ''}
                    onChange={(e) => onUpdateArticle({ [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              )
            } else if (field === 'status') {
              // 状态选择框
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  <select
                    value={value as string || ''}
                    onChange={(e) => onUpdateArticle({ [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            } else if (field === 'tags') {
              // 标签输入
              const tags = value as string[] || []
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  <input
                    type="text"
                    value={tags.join(', ')}
                    onChange={(e) => onUpdateArticle({ 
                      [field]: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                    placeholder="输入标签，用逗号分隔"
                  />
                  <p className="text-sm text-gray-500 mt-2">例如: 科技,人工智能,新闻</p>
                </div>
              )
            } else if (typeof value === 'boolean') {
              // 布尔值字段
              return (
                <div key={field} className="border-b pb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value as boolean}
                      onChange={(e) => onUpdateArticle({ [field]: e.target.checked })}
                      className="mr-3 h-5 w-5 text-blue-600"
                    />
                    <span className="text-lg font-semibold">{fieldLabel}</span>
                  </label>
                </div>
              )
            } else {
              // 普通文本字段
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  <input
                    type="text"
                    value={value as string || ''}
                    onChange={(e) => onUpdateArticle({ [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                    placeholder={`请输入${fieldLabel}`}
                  />
                </div>
              )
            }
          })}
        </div>

        {/* 底部按钮 */}
        <div className="mt-8 flex justify-end gap-4 pt-6 border-t">
          <button
            onClick={handleCancel}
            className="px-8 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
    </div>
  )
}