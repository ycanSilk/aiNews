'use client'

import type { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 ">
      <nav className="fixed top-0 left-0 right-0 shadow-sm border-b bg-blue-500 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 ">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">
                新闻管理系统
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">管理员</span>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-col flex-1 ">
        <aside className="w-64 bg-white shadow-sm fixed left-0 top-0 h-screen overflow-y-auto">
          <nav className="mt-8">
            <div className="px-4 space-y-2 mt-20">
              <a
                href="/admin/dashboard"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>仪表板</span>
              </a>
              <a
                href="/admin/news"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>新闻列表管理</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>用户管理</span>
              </a>
              <a
                href="/admin/articles"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>文章管理</span>
              </a>
              <a
                href="/admin/database"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>数据库操作</span>
              </a>
              <a
                href="/admin/categories"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>分类管理</span>
              </a>
              <a
                href="/admin/tags"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>标签管理</span>
              </a>
            </div>
          </nav>
        </aside>

        <main className="flex-1 ml-64 pt-16">
          {children}
        </main>
      </div>
    </div>
  )
}