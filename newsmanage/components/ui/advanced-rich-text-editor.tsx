'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { useState } from 'react'

interface AdvancedRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export default function AdvancedRichTextEditor({ 
  value, 
  onChange, 
  placeholder = '开始撰写内容...',
  className = '',
  minHeight = '400px'
}: AdvancedRichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showTableInput, setShowTableInput] = useState(false)
  const [tableRows, setTableRows] = useState(3)
  const [tableCols, setTableCols] = useState(3)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 ${className}`,
        style: { minHeight },
        placeholder,
      },
    },
  })

  const addLink = () => {
    if (linkUrl.trim()) {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl.trim()) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const addTable = () => {
    if (tableRows > 0 && tableCols > 0) {
      editor?.chain().focus().insertTable({ 
        rows: tableRows, 
        cols: tableCols, 
        withHeaderRow: true 
      }).run()
      setTableRows(3)
      setTableCols(3)
      setShowTableInput(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 工具栏 - 第一行 */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* 文本样式 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-300' : ''
          }`}
          title="粗体"
        >
          <strong>B</strong>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-300' : ''
          }`}
          title="斜体"
        >
          <em>I</em>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('underline') ? 'bg-gray-300' : ''
          }`}
          title="下划线"
        >
          <u>U</u>
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('strike') ? 'bg-gray-300' : ''
          }`}
          title="删除线"
        >
          <s>S</s>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('highlight') ? 'bg-gray-300' : ''
          }`}
          title="高亮"
        >
          🖍️
        </button>

        {/* 标题 */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value)
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
            }
          }}
          className="p-2 border rounded text-sm"
          title="标题级别"
        >
          <option value="0">段落</option>
          <option value="1">标题 1</option>
          <option value="2">标题 2</option>
          <option value="3">标题 3</option>
          <option value="4">标题 4</option>
          <option value="5">标题 5</option>
          <option value="6">标题 6</option>
        </select>

        {/* 列表 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bulletList') ? 'bg-gray-300' : ''
          }`}
          title="无序列表"
        >
          •
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('orderedList') ? 'bg-gray-300' : ''
          }`}
          title="有序列表"
        >
          1.
        </button>

        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('taskList') ? 'bg-gray-300' : ''
          }`}
          title="任务列表"
        >
          ☑️
        </button>

        {/* 对齐 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
          }`}
          title="左对齐"
        >
          ≡
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
          }`}
          title="居中"
        >
          ≡
        </button>
        
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
          }`}
          title="右对齐"
        >
          ≡
        </button>

        {/* 链接 */}
        <button
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('link') ? 'bg-gray-300' : ''
          }`}
          title="添加链接"
        >
          🔗
        </button>

        {/* 图片 */}
        <button
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 rounded hover:bg-gray-200"
          title="插入图片"
        >
          🖼️
        </button>

        {/* 表格 */}
        <button
          onClick={() => setShowTableInput(!showTableInput)}
          className="p-2 rounded hover:bg-gray-200"
          title="插入表格"
        >
          📊
        </button>

        {/* 清除格式 */}
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="清除格式"
        >
          🧹
        </button>

        {/* 撤销/重做 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="撤销"
        >
          ↩️
        </button>
        
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="重做"
        >
          ↪️
        </button>
      </div>

      {/* 链接输入框 */}
      {showLinkInput && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="输入链接URL"
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={addLink}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            添加
          </button>
          <button
            onClick={() => setShowLinkInput(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      )}

      {/* 图片输入框 */}
      {showImageInput && (
        <div className="bg-blue-50 border-b border-blue-200 p-2 flex items-center gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="输入图片URL"
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={addImage}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            插入
          </button>
          <button
            onClick={() => setShowImageInput(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      )}

      {/* 表格输入框 */}
      {showTableInput && (
        <div className="bg-purple-50 border-b border-purple-200 p-2 flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">行数:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={tableRows}
              onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
              className="w-12 px-2 py-1 border rounded text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">列数:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={tableCols}
              onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
              className="w-12 px-2 py-1 border rounded text-sm"
            />
          </div>
          <button
            onClick={addTable}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            插入表格
          </button>
          <button
            onClick={() => setShowTableInput(false)}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            取消
          </button>
        </div>
      )}

      {/* 编辑器内容区域 */}
      <EditorContent editor={editor} />
      
      {/* 字数统计 */}
      <div className="bg-gray-50 border-t border-gray-300 p-2 text-xs text-gray-500 flex justify-between">
        <span>字数: {editor.getText().length} 字符</span>
        <span>行数: {editor.getText().split('\n').length}</span>
      </div>
    </div>
  )
}