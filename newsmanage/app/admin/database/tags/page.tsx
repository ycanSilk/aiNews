import type { ReactNode } from 'react'

export default function TagsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">标签表管理</h1>
        <p className="text-gray-600 mt-2">管理系统文章标签数据表</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">标签列表</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            添加标签
          </button>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">标签名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用次数</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">人工智能</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-01</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                  <button className="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">机器学习</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">32</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-05</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                  <button className="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">深度学习</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">28</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-01-10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                  <button className="text-red-600 hover:text-red-900">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}