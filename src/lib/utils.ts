import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 公司名称映射表（中文->英文）
const companyMap: Record<string, string> = {
  '百度': 'baidu',
  '阿里': 'alibaba',
  '阿里巴巴': 'alibaba',
  '哔哩哔哩': 'bilibili',
  '华为': 'huawei',
  '小米': 'xiaomi',
  '深度求索': 'deepseek',
  '文心一言': 'yiyan',
  'openai': 'openai',
  'google': 'google',
  'microsoft': 'microsoft',
  'meta': 'meta',
  'tesla': 'tesla',
  'deepseek': 'deepseek'
};

// 产品名称映射表
const productMap: Record<string, string> = {
  '文心一言': 'yiyan',
  'chatgpt': 'chatgpt',
  'gemini': 'gemini',
  'copilot': 'copilot',
  'llama': 'llama',
  'optimus': 'optimus',
  '昇腾': 'ascend',
  '芯片': 'chip'
};

/**
 * 生成语义化新闻ID
 * 格式: {公司名}-{产品名}-{YYYYMMDD}{三位序号}
 * 示例: openai-gpt5-20250827001
 */
export function generateSemanticId(
  title: string, 
  date: string, 
  sequence: number = 1,
  customCompany?: string,
  customProduct?: string
): string {
  // 提取公司名称（常见AI公司列表）
  const companyPatterns = [
    'openai', 'chatgpt', 'google', 'gemini', 'microsoft', 'copilot', 'meta', 'llama',
    'tesla', 'nvidia', 'amd', 'intel', 'apple', 'amazon', 'aws', 'anthropic', 'claude',
    'baidu', 'ernie', 'alibaba', 'tencent', 'huawei', 'samsung', 'ibm', 'oracle',
    'tsinghua', 'thudm', '清华大学', '华为', '百度', '阿里巴巴', '腾讯'
  ];

  // 提取产品名称（常见AI产品列表）
  const productPatterns = [
    'gpt', 'dall-e', 'midjourney', 'stable diffusion', 'bard', 'palm', 'bert',
    'tensorflow', 'pytorch', 'keras', 'transformers', 'huggingface', 'langchain',
    'autogpt', 'agentgpt', 'babyagi', 'pinecone', 'weaviate', 'chroma',
    'llama', 'mistral', 'falcon', 'bloom', 'opt', 't5', 'blenderbot',
    'claude', 'anthropic', 'cohere', 'ai21', 'stability', 'runway',
    'replicate', 'together', 'banana', 'modal', 'beam', 'vast', 'lambda',
    'cerebras', 'graphcore', 'sambanova', 'groq', 'mythic', 'tenstorrent'
  ];

  const lowerTitle = title.toLowerCase();
  
  // 查找公司名称（优先使用自定义的公司名）
  let company = customCompany || '';
  if (!company) {
    // 首先检查映射表中的公司名称
    for (const [chineseName, englishName] of Object.entries(companyMap)) {
      if (lowerTitle.includes(chineseName.toLowerCase()) || lowerTitle.includes(englishName)) {
        company = englishName;
        break;
      }
    }
    
    // 如果没有匹配的映射，检查其他常见模式
    if (!company) {
      for (const pattern of companyPatterns) {
        if (lowerTitle.includes(pattern.toLowerCase())) {
          company = pattern.toLowerCase();
          break;
        }
      }
    }
  }

  // 查找产品名称（优先使用自定义的产品名）
  let product = customProduct || '';
  if (!product) {
    // 首先检查映射表中的产品名称（但排除已经在公司映射表中匹配到的名称）
    for (const [chineseName, englishName] of Object.entries(productMap)) {
      if ((lowerTitle.includes(chineseName.toLowerCase()) || lowerTitle.includes(englishName)) && 
          !company.includes(englishName)) { // 避免与公司名重复
        product = englishName;
        break;
      }
    }
    
    // 如果没有匹配的映射，检查其他常见模式
    if (!product) {
      for (const pattern of productPatterns) {
        if (lowerTitle.includes(pattern.toLowerCase()) && !company.includes(pattern)) {
          product = pattern.toLowerCase();
          break;
        }
      }
    }
  }

  // 如果没有找到特定的公司或产品，使用通用名称
  if (!company) {
    // 如果没有匹配到预定义公司，使用通用名称或允许自定义
    company = 'ai';
  }
  if (!product) {
    // 从标题中提取主要关键词作为产品名
    const words = title.toLowerCase().split(/[\s\-]+/);
    const mainWords = words.filter(word => 
      word.length > 2 && 
      !['the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'a', 'an'].includes(word)
    );
    
    // 限制产品名长度，避免URL过长
    product = mainWords.slice(0, 3).join('-') || 'news';
    
    // 如果产品名过长，进行截断
    if (product.length > 20) {
      product = product.substring(0, 20).replace(/[-]+$/, '');
    }
  }

  // 清理特殊字符，只保留英文、数字、连字符
  company = company.replace(/[^\w-]/g, '').trim().replace(/\s+/g, '-');
  product = product.replace(/[^\w-]/g, '').trim().replace(/\s+/g, '-');

  // 如果公司或产品名包含非英文字符，使用默认值
  if (!/^[a-zA-Z0-9-]+$/.test(company)) {
    company = 'ai';
  }
  if (!/^[a-zA-Z0-9-]+$/.test(product)) {
    product = 'news';
  }

  // 格式化日期
  const formattedDate = date.replace(/-/g, '');
  
  // 格式化序号（3位数字）
  const formattedSequence = sequence.toString().padStart(3, '0');

  const rawId = `${company}-${product}-${formattedDate}${formattedSequence}`;
  
  // 对ID进行URL编码，确保可以作为URL的一部分
  return encodeURIComponent(rawId);
}

/**
 * 批量生成语义化ID，确保同日内不重复
 * 可以传入自定义的公司和产品映射表来处理未定义的关键词
 */

export function generateSemanticIds(
  newsItems: Array<{title: string, date: string}>, 
  customMappings?: {[key: string]: {company?: string, product?: string}}
): string[] {
  const dateCounts = new Map<string, number>();
  const ids: string[] = [];

  for (const item of newsItems) {
    const dateKey = item.date;
    const count = (dateCounts.get(dateKey) || 0) + 1;
    dateCounts.set(dateKey, count);
    
    // 如果有自定义映射，优先使用自定义的公司和产品名
    let customCompany = customMappings?.[item.title]?.company;
    let customProduct = customMappings?.[item.title]?.product;
    
    const id = generateSemanticId(
      item.title, 
      item.date, 
      count,
      customCompany,
      customProduct
    );
    ids.push(id);
  }

  return ids;
}

/**
 * 格式化ISO日期字符串为中文格式
 * 输入格式: 2025-08-29T08:13:25.329Z
 * 输出格式: 2025年8月29日
 */
export function formatDateToChinese(dateString: string): string {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
} catch (error) {
  console.error('日期格式化错误:', error);
  return dateString; // 如果格式化失败，返回原始字符串
}
}

/**
 * 格式化ISO日期字符串为英文格式
 * 输入格式: 2025-08-29T08:13:25.329Z
 * 输出格式: August 29, 2025
 */
export function formatDateToEnglish(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateString; // 如果格式化失败，返回原始字符串
  }
}

/**
 * 根据当前语言格式化日期
 * 输入格式: 2025-08-29T08:13:25.329Z
 * 输出格式: 中文 -> 2025年8月29日, 英文 -> August 29, 2025
 */
export function formatDateByLanguage(dateString: string, language: string): string {
  if (language === 'en') {
    return formatDateToEnglish(dateString);
  } else {
    return formatDateToChinese(dateString);
  }
}

/**
 * 生成递增的浏览量（基于原始浏览量和随机因子）
 * 算法：原始浏览量 + 随机数(0-50) + 时间因子(0-20)
 */
export function generateIncrementedViews(originalViews: number): number {
  const randomIncrement = Math.floor(Math.random() * 51); // 0-50的随机数
  const timeFactor = Math.floor(Math.random() * 21); // 0-20的时间因子
  return originalViews + randomIncrement + timeFactor;
}
