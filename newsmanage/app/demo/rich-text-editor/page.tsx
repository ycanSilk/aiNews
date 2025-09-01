'use client'

import { useState } from 'react'
import RichTextEditor from '@/components/ui/rich-text-editor'

export default function RichTextEditorDemo() {
  const [content, setContent] = useState('<h2>欢迎使用富文本编辑器</h2><p>这是一个功能丰富的编辑器，支持：</p><ul><li><strong>粗体</strong>、<em>斜体</em>、<u>下划线</u></li><li>多级标题</li><li>有序和无序列表</li><li>链接和图片插入</li><li>文本对齐</li><li>多媒体内容</li></ul>')

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">富文本编辑器演示</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">编辑器功能说明</h2>
        <div className="prose prose-sm mb-4">
          <p>这个富文本编辑器基于Tiptap构建，支持以下功能：</p>
          <ul>
            <li><strong>文本格式化</strong>：粗体、斜体、下划线、删除线</li>
            <li><strong>标题系统</strong>：支持H1-H6多级标题</li>
            <li><strong>列表</strong>：有序列表和无序列表</li>
            <li><strong>链接插入</strong>：支持URL链接插入和编辑</li>
            <li><strong>图片插入</strong>：支持图片URL插入</li>
            <li><strong>文本对齐</strong>：左对齐、居中、右对齐</li>
            <li><strong>撤销/重做</strong>：完整的编辑历史管理</li>
            <li><strong>多语言内容</strong>：支持中英文内容编辑</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">编辑器演示</h2>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="开始撰写您的内容..."
          className="min-h-[300px]"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">生成的HTML内容</h2>
        <div className="bg-gray-100 p-4 rounded border">
          <pre className="text-sm whitespace-pre-wrap break-words">
            {content}
          </pre>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">使用说明：</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 使用工具栏按钮格式化文本</li>
            <li>• 点击🔗图标添加链接</li>
            <li>• 点击🖼️图标插入图片</li>
            <li>• 使用撤销/重做按钮管理编辑历史</li>
            <li>• 内容实时保存，可直接在文章管理页面使用</li>
          </ul>
        </div>
      </div>
    </div>
  )
}