'use client'

import LoginForm from '@/components/forms/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          登录管理系统
        </h1>
        <LoginForm />
      </div>
    </div>
  )
}