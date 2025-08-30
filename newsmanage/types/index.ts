export interface User {
  _id: string
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface News {
  _id: string
  title: string
  content: string
  summary?: string
  category: string
  tags: string[]
  author: User
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  views: number
  featured: boolean
  imageUrl?: string
  slug: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sort?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}