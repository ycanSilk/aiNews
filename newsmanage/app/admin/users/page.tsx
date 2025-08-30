export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          添加用户
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="搜索用户..."
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <select className="px-3 py-2 border rounded-md">
              <option>所有角色</option>
              <option>管理员</option>
              <option>编辑</option>
              <option>用户</option>
            </select>
            <select className="px-3 py-2 border rounded-md">
              <option>所有状态</option>
              <option>活跃</option>
              <option>禁用</option>
            </select>
          </div>
        </div>
        
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">用户名</th>
                <th className="text-left py-2">邮箱</th>
                <th className="text-left py-2">角色</th>
                <th className="text-left py-2">状态</th>
                <th className="text-left py-2">注册时间</th>
                <th className="text-left py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">暂无数据</td>
                <td className="py-3">-</td>
                <td className="py-3">-</td>
                <td className="py-3">-</td>
                <td className="py-3">-</td>
                <td className="py-3">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">编辑</button>
                    <button className="text-red-600 hover:text-red-800">禁用</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}