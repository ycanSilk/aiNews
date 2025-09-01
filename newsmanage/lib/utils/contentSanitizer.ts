import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// 创建DOM环境
const window = new JSDOM('').window
const domPurify = DOMPurify(window)

// 允许的HTML标签
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'div', 'span',
  'strong', 'em', 'b', 'i', 'u', 's',
  'ul', 'ol', 'li',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'a', 'img',
  'blockquote', 'code', 'pre',
  'hr'
]

// 允许的HTML属性
const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'target', 'rel',
  'class', 'style', 'id', 'name',
  'colspan', 'rowspan', 'align', 'valign',
  'border', 'cellpadding', 'cellspacing',
  'width', 'height'
]

// 自定义配置
const sanitizeConfig = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  USE_PROFILES: {
    html: true
  },
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'style']
}

/**
 * 清理HTML内容，防止XSS攻击
 * @param html 原始HTML内容
 * @returns 清理后的安全HTML
 */
export function sanitizeHTML(html: string): string {
  if (!html) return ''
  
  try {
    return domPurify.sanitize(html, sanitizeConfig)
  } catch (error) {
    console.error('HTML sanitization failed:', error)
    return ''
  }
}

/**
 * 验证HTML内容是否包含不允许的标签
 * @param html HTML内容
 * @returns 是否有效
 */
export function validateHTML(html: string): boolean {
  if (!html) return true
  
  const tempDiv = window.document.createElement('div')
  tempDiv.innerHTML = html
  
  // 检查是否有不允许的标签
  const forbiddenElements = tempDiv.querySelectorAll('script, style, iframe, form')
  if (forbiddenElements.length > 0) {
    return false
  }
  
  // 检查是否有危险属性
  const elementsWithDangerousAttrs = tempDiv.querySelectorAll('[onerror], [onload], [onclick]')
  if (elementsWithDangerousAttrs.length > 0) {
    return false
  }
  
  return true
}

/**
 * 提取纯文本内容（用于搜索索引）
 * @param html HTML内容
 * @returns 纯文本内容
 */
export function extractTextContent(html: string): string {
  if (!html) return ''
  
  const tempDiv = window.document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}

/**
 * 计算HTML内容的阅读时间
 * @param html HTML内容
 * @param readingSpeed 阅读速度（字/分钟），默认500
 * @returns 阅读时间（分钟）
 */
export function calculateReadTime(html: string, readingSpeed: number = 500): number {
  const textContent = extractTextContent(html)
  const wordCount = textContent.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / readingSpeed))
}

/**
 * 清理并验证文章内容
 * @param content 文章内容对象（包含zh和en）
 * @returns 清理后的内容对象
 */
export function sanitizeArticleContent(content: { zh: string; en: string }): { zh: string; en: string } {
  return {
    zh: sanitizeHTML(content.zh),
    en: sanitizeHTML(content.en)
  }
}

/**
 * 验证文章内容是否有效
 * @param content 文章内容对象
 * @returns 验证结果
 */
export function validateArticleContent(content: { zh: string; en: string }): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (content.zh && !validateHTML(content.zh)) {
    errors.push('中文内容包含不安全元素')
  }
  
  if (content.en && !validateHTML(content.en)) {
    errors.push('英文内容包含不安全元素')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 预处理文章内容（清理、验证、计算阅读时间）
 * @param articleData 文章数据
 * @returns 处理后的文章数据
 */
export function preprocessArticle(articleData: any): any {
  const processedData = { ...articleData }
  
  // 清理内容
  if (processedData.content) {
    processedData.content = sanitizeArticleContent(processedData.content)
  }
  
  // 计算阅读时间
  if (processedData.content) {
    const zhReadTime = calculateReadTime(processedData.content.zh)
    const enReadTime = calculateReadTime(processedData.content.en)
    processedData.readTime = Math.max(zhReadTime, enReadTime)
  }
  
  return processedData
}