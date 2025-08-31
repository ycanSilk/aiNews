'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'

interface AdminUser {
  _id: string
  username: string
  email: string
  password: string
  role: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
  [key: string]: any
}

interface FieldOperation {
  type: 'add' | 'remove' | 'rename'
  fieldName: string
  newFieldName?: string
  fieldType?: string
  fieldValue?: any
}

export default function AdminUserPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [fieldOperations, setFieldOperations] = useState<FieldOperation[]>([])
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState('string')
  const [newFieldValue, setNewFieldValue] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/database/adminuser')
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data.items || [])
        setFields(result.data.fields || [])
      } else {
        console.error('加载用户数据失败:', result.error)
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddField = () => {
    if (!newFieldName.trim()) return
    
    const operation: FieldOperation = {
      type: 'add',
      fieldName: newFieldName.trim(),
      fieldType: newFieldType,
      fieldValue: parseFieldValue(newFieldValue, newFieldType)
    }
    
    setFieldOperations([...fieldOperations, operation])
    setNewFieldName('')
    setNewFieldValue('')
  }

  const handleRemoveField = async (user: AdminUser, fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    if (!confirm(`确定要删除字段 ${fieldName} 吗？`)) return
    
    try {
      const response = await fetch('/api/admin/database/adminuser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetId: user._id,
          fieldName
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('字段删除成功')
        await loadUsers() // 刷新数据
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除字段失败:', error)
      alert('删除失败，请重试')
    }
  }

  const handleEditField = async (user: AdminUser, fieldName: string) => {
    const password = prompt('请输入确认密码（0401）:')
    if (password !== '0401') {
      alert('密码错误，操作取消')
      return
    }
    
    const newFieldName = prompt(`修改字段名 ${fieldName} 为:`)
    
    if (newFieldName !== null && newFieldName.trim() !== '') {
      try {
        const response = await fetch('/api/admin/database/adminuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              operations: [{
                type: 'rename',
                fieldName: fieldName,
                newFieldName: newFieldName.trim(),
                targetId: user._id
              }]
            })
        })

        const result = await response.json()
        
        if (result.success) {
          alert('字段名修改成功')
          await loadUsers() // 刷新数据
        } else {
          alert('修改失败: ' + result.error)
        }
      } catch (error) {
        console.error('修改字段名失败:', error)
        alert('修改失败，请重试')
      }
    }
  }

  const parseFieldValue = (value: string, type: string): any => {
    switch (type) {
      case 'number':
        return Number(value)
      case 'boolean':
        return value.toLowerCase() === 'true'
      case 'object':
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      case 'array':
        try {
          return JSON.parse(value)
        } catch {
          return []
        }
      default:
        return value
    }
  }

  const applyFieldOperations = async () => {
    if (fieldOperations.length === 0) return
    
    if (!selectedUser) {
      alert('请先选择一个用户')
      return
    }

    try {
      const operationsWithTargetId = fieldOperations.map(op => ({
        ...op,
        targetId: selectedUser._id
      }))

      console.log('=== 前端调试信息 ===')
      console.log('选中的用户:', selectedUser)
      console.log('待执行操作:', JSON.stringify(operationsWithTargetId, null, 2))
      console.log('请求URL:', '/api/admin/database/adminuser')
      console.log('请求方法: POST')
      console.log('请求体:', JSON.stringify({ operations: operationsWithTargetId }, null, 2))

      const response = await fetch('/api/admin/database/adminuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ operations: operationsWithTargetId })
      })

      console.log('响应状态:', response.status)
      console.log('响应状态文本:', response.statusText)

      const result = await response.json()
      console.log('API响应:', JSON.stringify(result, null, 2))
      
      if (result.success) {
        console.log('操作成功，清空操作队列并重新加载用户数据')
        setFieldOperations([])
        await loadUsers()
        alert('字段操作成功')
      } else {
        console.log('操作失败:', result.error)
        alert('操作失败: ' + result.error)
      }
    } catch (error) {
      console.error('应用字段操作失败:', error)
      if (error instanceof Error) {
        console.error('错误详情:', error.message)
      } else {
        console.error('未知错误类型:', error)
      }
      alert('操作失败')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className='container p-10'>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>Admin用户管理</h1>
      <p className='text-gray-600 mb-4'>管理系统管理员用户账户</p>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">字段管理</h2>      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="  text-sm font-medium text-gray-700 mb-2">新字段名</label>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              className="w-64 px-3 py-2 border rounded-md"
              placeholder="输入字段名"
            />
          </div>
          
          <div>
            <label className=" text-sm font-medium text-gray-700 mb-2">字段类型</label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="w-64 px-3 py-2 border rounded-md"
            >
              <option value="string">字符串</option>
              <option value="number">数字</option>
              <option value="boolean">布尔值</option>
              <option value="object">对象</option>
              <option value="array">数组</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">字段值</label>
            <input
              type="text"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="w-80 px-3 py-2 border rounded-md"
              placeholder="输入字段值（JSON格式对象/数组）"
            />
          </div>
        </div>

        <button
          onClick={handleAddField}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          添加字段
        </button>

        <div className="mt-4">
          {fieldOperations.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-2">待执行操作</h3>
              <ul className="space-y-2">
                {fieldOperations.map((op, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>
                      {op.type === 'add' ? '添加' : '删除'}字段: {op.fieldName}
                      {op.fieldType && ` (${op.fieldType})`}
                    </span>
                    <button
                      onClick={() => {
                        const newOps = [...fieldOperations]
                        newOps.splice(index, 1)
                        setFieldOperations(newOps)
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      取消
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <button
            onClick={() => {
              console.log('=== 应用操作按钮被点击 ===')
              console.log('按钮点击时间:', new Date().toLocaleString())
              console.log('当前选中用户:', selectedUser)
              console.log('待执行操作数量:', fieldOperations.length)
              console.log('测试：按钮点击事件触发成功！')
              applyFieldOperations()
            }}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={fieldOperations.length === 0}
          >
            应用操作
          </button>
        </div>
      </div>
      {/* 用户数据表格 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">用户数据</h2>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">所有字段: {fields.join('     |     ')}</h3>
        </div>

        <div className="mb-4">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? '加载中...' : '查询/刷新数据'}
          </button>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center mb-4">
                <input
                  type="radio"
                  name="selectedUser"
                  checked={selectedUser?._id === user._id}
                  onChange={() => setSelectedUser(user)}
                  className="h-4 w-4 text-blue-600 mr-3"
                />
                <h3 className="text-lg font-medium">用户: {user.username}</h3>
              </div>
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">字段名</th>
                    <th className="border p-2 text-left">字段值</th>
                    <th className="border p-2 text-left">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((field) => (
                    <tr key={field} className="border hover:bg-gray-50">
                      <td className="border p-2 font-medium text-gray-700">{field}</td>
                      <td className="border p-2 text-gray-600">
                        {typeof user[field] === 'object' 
                          ? JSON.stringify(user[field])
                          : String(user[field] || '-')
                        }
                      </td>
                      <td className="border p-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditField(user, field)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                          >
                            修改
                          </button>
                          <button
                            onClick={() => handleRemoveField(user, field)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}