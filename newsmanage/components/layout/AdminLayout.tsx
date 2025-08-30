'use client'

import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
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

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
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
                <span>新闻管理</span>
              </a>
              <a
                href="/admin/users"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <span>用户管理</span>
              </a>
            </div>
          </nav>
        </aside>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}