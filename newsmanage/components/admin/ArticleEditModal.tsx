'use client'

import { useState } from 'react'
import AdvancedRichTextEditor from '@/components/ui/advanced-rich-text-editor'

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

interface ArticleEditModalProps {
  isOpen: boolean
  editingNews: EditNewsData | null
  isSubmitting: boolean
  categories: { displayName: string; value: string }[]
  statusOptions: string[]
  onClose: () => void
  onSave: () => void
  onUpdateNews: (news: EditNewsData) => void
}

const fieldMappings = {
  _id: 'ID',
  semanticId: '语义ID',
  title: '标题',
  summary: '摘要',
  content: '内容',
  category: '分类',
  author: '作者',
  views: '浏览量',
  imageUrl: '图片URL',
  slug: 'Slug',
  publishedAt: '发布时间',
  date: '日期',
  comments: '评论数',
  isHot: '热门新闻',
  isImportant: '推荐新闻',
  isCritical: '重要新闻',
  tags: '标签',
  locales: '多语言配置',
  externalUrl: '外部跳转URL',
  status: '状态',
  createdAt: '创建时间',
  updatedAt: '更新时间'
}

const getDynamicFields = () => {
  const excludeFields = ['_id', 'locales', 'publishTime', 'date', 'weekday']
  return Object.keys(fieldMappings).filter(field => !excludeFields.includes(field))
}

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

export default function ArticleEditModal({
  isOpen,
  editingNews,
  isSubmitting,
  categories,
  statusOptions,
  onClose,
  onSave,
  onUpdateNews
}: ArticleEditModalProps) {
  const [tempSearchKeyword, setTempSearchKeyword] = useState('')

  if (!isOpen || !editingNews) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{editingNews.id ? '编辑新闻' : '添加新闻'}</h2>
        
        <div className="space-y-4">
          {/* 复选框组 - 横向排列 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {['isHot', 'isImportant', 'isCritical'].map((field) => {
              const fieldLabel = fieldMappings[field] || field
              const value = editingNews[field as keyof EditNewsData]
              return (
                <div key={field} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => onUpdateNews({ ...editingNews, [field]: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">{fieldLabel}</label>
                </div>
              )
            })}
          </div>

          {getDynamicFields().map((field) => {
            const fieldLabel = fieldMappings[field] || field
            const value = editingNews[field as keyof EditNewsData]
            
            // 排除不需要在模态框中显示的字段
            const excludedFields = ['_id', 'views', 'comments', 'createdAt', 'updatedAt', 'readTime', 'isHot', 'isImportant', 'isCritical', 'featured']
            if (excludedFields.includes(field)) {
              return null
            }
            
            // 根据字段类型渲染不同的输入组件
            if (field === 'title' || field === 'summary' || field === 'content') {
              // 多语言文本字段
              const multiLangValue = value as { zh: string; en: string } || { zh: '', en: '' }
              return (
                <div key={field} className="border-b pb-4">
                  <label className="block text-sm font-medium mb-1">{fieldLabel} (中文)</label>
                  {field === 'content' ? (
                    <AdvancedRichTextEditor
                      value={multiLangValue.zh || ''}
                      onChange={(value) => onUpdateNews({
                        ...editingNews,
                        [field]: { ...multiLangValue, zh: value }
                      })}
                      className="w-full"
                      minHeight="300px"
                      placeholder={`请输入中文${fieldLabel}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={multiLangValue.zh || ''}
                      onChange={(e) => onUpdateNews({
                        ...editingNews,
                        [field]: { ...multiLangValue, zh: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={`请输入中文${fieldLabel}`}
                    />
                  )}
                  
                  <label className="block text-sm font-medium mb-1 mt-2">{fieldLabel} (英文)</label>
                  {field === 'content' ? (
                    <AdvancedRichTextEditor
                      value={multiLangValue.en || ''}
                      onChange={(value) => onUpdateNews({
                        ...editingNews,
                        [field]: { ...multiLangValue, en: value }
                      })}
                      className="w-full"
                      minHeight="300px"
                      placeholder={`请输入英文${fieldLabel}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={multiLangValue.en || ''}
                      onChange={(e) => onUpdateNews({
                        ...editingNews,
                        [field]: { ...multiLangValue, en: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={`请输入英文${fieldLabel}`}
                    />
                  )}
                </div>
              )
            } else if (field === 'category') {
              // 分类选择框
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{fieldLabel}</label>
                  <select
                    value={value as string || ''}
                    onChange={(e) => onUpdateNews({ ...editingNews, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">选择分类</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.displayName}</option>
                    ))}
                  </select>
                </div>
              )
            } else if (field === 'tags') {
              // 标签输入
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{fieldLabel}</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px]">
                    {(Array.isArray(value) ? value : []).map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => {
                            const newTags = (Array.isArray(value) ? value : []).filter((_, i) => i !== index)
                            onUpdateNews({ ...editingNews, [field]: newTags })
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
                          const newTags = [...(Array.isArray(value) ? value : []), newTag]
                          onUpdateNews({ ...editingNews, [field]: newTags })
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              )
            } else if (field === 'publishedAt' || field === 'publishTime') {
              // 日期时间选择器
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{fieldLabel}</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value as string || ''}
                      onChange={(e) => onUpdateNews({ 
                        ...editingNews, 
                        [field]: e.target.value
                      })}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder="输入日期时间 (YYYY-MM-DDTHH:MM:SS)"
                    />
                    <input
                      type="datetime-local"
                      value={value ? formatDateTimeForInput(value as string) : ''}
                      onChange={(e) => onUpdateNews({ 
                        ...editingNews, 
                        [field]: e.target.value ? new Date(e.target.value).toISOString() : '' 
                      })}
                      className="w-60 px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )
            } else if (field === 'status') {
              // 状态选择框
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{fieldLabel}</label>
                  <select
                    value={value as string || 'draft'}
                    onChange={(e) => onUpdateNews({ 
                      ...editingNews, 
                      [field]: e.target.value
                    })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="draft">草稿</option>
                    <option value="published">已发布</option>
                    <option value="archived">已归档</option>
                  </select>
                </div>
              )
            } else {
              // 普通文本输入框
              return (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">{fieldLabel}</label>
                  <input
                    type="text"
                    value={value as string || ''}
                    onChange={(e) => onUpdateNews({ ...editingNews, [field]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`请输入${fieldLabel}`}
                  />
                </div>
              )
            }
          })}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            onClick={onSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (editingNews.id ? '保存中...' : '创建中...') : (editingNews.id ? '保存' : '创建')}
          </button>
        </div>
      </div>
    </div>
  )
}