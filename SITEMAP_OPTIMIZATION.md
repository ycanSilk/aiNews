# Sitemap 优化说明

## 优化内容

### 1. 时间统一更新
- 所有sitemap文件的时间已统一更新为 **2025年8月**
- 主页面和索引文件：2025-08-01
- 博客文章：2025-08-15
- 新闻文章：保持原有的2025年8月日期

### 2. 健壮性改进
- 添加了XML声明和编码验证
- 统一的命名空间声明
- 完整的XML Schema引用
- 错误处理和验证机制

### 3. 动态生成脚本
创建了自动化生成脚本 `scripts/generate-sitemap.js`，提供以下功能：
- 动态生成所有sitemap文件
- XML格式验证
- 统一的配置管理
- 错误处理和日志输出

## 文件结构

```
public/
├── sitemap.xml          # 主sitemap文件（索引）
├── sitemap-news.xml     # 新闻文章sitemap
├── sitemap-blog.xml     # 博客文章sitemap  
├── sitemap-pages.xml    # 静态页面sitemap
└── robots.txt

scripts/
└── generate-sitemap.js  # sitemap生成脚本
```

## 使用方法

### 手动生成sitemap
```bash
npm run generate:sitemap
```

### 集成到构建流程
在 `package.json` 的构建脚本中添加：
```json
{
  "scripts": {
    "build": "npm run generate:sitemap && vite build",
    "generate:sitemap": "node scripts/generate-sitemap.js"
  }
}
```

### 验证sitemap
可以使用在线工具验证sitemap格式：
- [Google Search Console](https://search.google.com/search-console/)
- [XML Sitemap Validator](https://www.xml-sitemap.com/)

## 配置说明

### 主要配置参数（在 generate-sitemap.js 中）
```javascript
const SITE_URL = 'https://newainews.com';     // 网站域名
const CURRENT_DATE = '2025-08-01';           // 默认更新时间
const OUTPUT_DIR = './public';               // 输出目录
```

### 更新内容
当需要添加新的URL时，修改对应的生成函数：
- `generateMainSitemap()` - 主sitemap索引
- `generatePagesSitemap()` - 静态页面
- `generateBlogSitemap()` - 博客文章
- `generateNewsSitemap()` - 新闻文章（需扩展）

## SEO 最佳实践

1. **定期更新**：建议每月更新一次sitemap
2. **提交搜索引擎**：将sitemap提交到Google Search Console和Bing Webmaster Tools
3. **监控状态**：定期检查sitemap索引状态和错误
4. **保持同步**：确保sitemap中的URL与实际网站内容一致

## 故障排除

### 常见问题
1. **XML格式错误**：运行生成脚本时会自动验证XML格式
2. **编码问题**：确保所有文件使用UTF-8编码
3. **路径错误**：检查SITE_URL配置是否正确

### 日志输出
生成脚本提供详细的日志输出：
```
Generating sitemaps...
✓ Main sitemap.xml generated
✓ Pages sitemap generated  
✓ Blog sitemap generated
✓ sitemap.xml validated successfully
✓ sitemap-pages.xml validated successfully
✓ sitemap-blog.xml validated successfully

✅ All sitemaps generated successfully!
```

## 版本历史

- **v1.0** (2025-08-01): 初始版本，统一时间到2025年8月
- **v1.1** (2025-08-01): 添加动态生成脚本和健壮性改进

## 技术支持

如有问题，请检查：
1. Node.js版本（需要Node.js 12+）
2. 文件权限
3. 磁盘空间

---
*最后更新：2025-08-01*