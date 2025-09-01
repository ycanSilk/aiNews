'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import EnhancedRichTextEditor from '@/components/ui/enhanced-rich-text-editor'

interface EditArticleData {
  _id?: string
  semanticId: string
  title: { zh: string; en: string }
  summary: { zh: string; en: string }
  content?: { zh: string; en: string }
  category: string
  author: string
  views: number
  slug: string
  publishedAt: string
  tags: string[]
  isFeatured: boolean
  createdAt?: string
  updatedAt?: string
}

const fieldMappings: Record<string, string> = {
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
  isFeatured: '是否推荐',
  createdAt: '创建时间',
  updatedAt: '更新时间'
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

export default function ArticleAddPage() {
  const router = useRouter()
  
  const [editingArticle, setEditingArticle] = useState<EditArticleData>({
    semanticId: '',
    title: { zh: '', en: '' },
    summary: { zh: '', en: '' },
    content: { zh: '', en: '' },
    category: '',
    author: '',
    views: 0,
    slug: '',
    publishedAt: new Date().toISOString().split('T')[0],
    tags: [],
    isFeatured: false
  })
  
  const [categories, setCategories] = useState<Array<{value: string, displayName: string}>>([])
  const [users, setUsers] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    loadCategories()
    loadUsers()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const categoriesData = await response.json()
        // 转换分类数据格式为 {value, displayName}
        const formattedCategories = categoriesData.map((cat: any) => ({
          value: cat._id || cat.value,
          displayName: cat.name?.zh || cat.name?.en || cat.name || cat._id
        }))
        setCategories(formattedCategories)
      }
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/database/adminuser')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.data?.items || [])
      }
    } catch (error) {
      console.error('加载用户失败:', error)
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setError('')
    
    // 调试输出：显示所有字段的值
    console.log('=== 提交的文章数据 ===')
    console.log('完整数据:', JSON.stringify(editingArticle, null, 2))
    console.log('各字段详情:')
    Object.entries(editingArticle).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        console.log(`${key}:`, JSON.stringify(value, null, 2))
      } else {
        console.log(`${key}:`, value)
      }
    })
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
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
        setError(errorData.message || '创建失败')
      }
    } catch (err) {
      setError('创建时发生错误')
      console.error('Error creating article:', err)
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">添加文章</h1>
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
              {isSubmitting ? '创建中...' : '创建'}
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
            const excludedFields = ['_id', 'views', 'createdAt', 'updatedAt']
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
                    required
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
            } else if (field === 'author') {
              // 作者选择框
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  <select
                    value={value as string || ''}
                    onChange={(e) => onUpdateArticle({ [field]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                    required
                  >
                    <option value="">选择作者</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username || user.email || user._id}
                      </option>
                    ))}
                  </select>
                </div>
              )

            } else if (field === 'tags') {
              // 标签输入（支持回车生成）
              const tags = value as string[] || []
              
              const handleTagKeyDown = (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' && tagInput.trim()) {
                  e.preventDefault()
                  const newTags = [...tags, tagInput.trim()]
                  onUpdateArticle({ [field]: newTags })
                  setTagInput('')
                }
              }
              
              const removeTag = (index: number) => {
                const newTags = tags.filter((_, i) => i !== index)
                onUpdateArticle({ [field]: newTags })
              }
              
              return (
                <div key={field} className="border-b pb-6">
                  <label className="block text-lg font-semibold mb-3">{fieldLabel}</label>
                  
                  {/* 已添加的标签显示 */}
                  {tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 标签输入框 */}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md text-lg"
                    placeholder="输入标签后按回车添加"
                  />
                  <p className="text-sm text-gray-500 mt-2">输入标签后按回车键添加</p>
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
            {isSubmitting ? '创建中...' : '创建文章'}
          </button>
        </div>
      </div>
    </div>
  )
}