import type { ReactNode } from 'react'

export default function DatabasePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">数据库操作</h1>
        <p className="text-gray-600 mt-2">管理系统数据库表和记录</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">数据库表管理</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/database/adminuser" className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-800 mb-2">Admin用户表</h3>
            <p className="text-gray-600 text-sm">管理管理员用户账户</p>
          </a>
          
          <a href="/admin/database/articles" className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-800 mb-2">文章表</h3>
            <p className="text-gray-600 text-sm">管理系统文章内容</p>
          </a>
          
          <a href="/admin/database/categories" className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-800 mb-2">分类表</h3>
            <p className="text-gray-600 text-sm">管理文章分类</p>
          </a>
          
          <a href="/admin/database/news" className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-800 mb-2">新闻表</h3>
            <p className="text-gray-600 text-sm">管理新闻内容</p>
          </a>
          
          <a href="/admin/database/tags" className="block border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-semibold text-gray-800 mb-2">标签表</h3>
            <p className="text-gray-600 text-sm">管理文章标签</p>
          </a>
        </div>
      </div>
    </div>
  )
}