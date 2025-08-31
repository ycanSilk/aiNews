import type { ReactNode } from 'react'

export default function ArticlesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">文章管理</h1>
        <p className="text-gray-600 mt-2">管理系统的文章内容</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">文章列表</h3>
            <p className="text-gray-600 text-sm">查看和管理所有文章</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">创建文章</h3>
            <p className="text-gray-600 text-sm">添加新的文章内容</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">文章分类</h3>
            <p className="text-gray-600 text-sm">管理文章分类和标签</p>
          </div>
        </div>
      </div>
    </div>
  )
}