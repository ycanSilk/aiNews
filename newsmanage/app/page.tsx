import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/auth/login')
  
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          News Management System
        </h1>
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">
            Welcome to the AI News Management System
          </p>
          <a 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  )
}