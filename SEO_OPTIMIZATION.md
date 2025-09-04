# NewAI News - SEO Optimization Guide

## Overview
This document outlines the comprehensive SEO optimization implemented for newainews.com, including sitemaps, robots.txt, meta tags, and structured data.

## Domain Configuration
- **Primary Domain**: newainews.com
- **Canonical URLs**: All pages use absolute canonical URLs with the domain
- **SSL**: HTTPS required for all pages

## Sitemap Files

### Main Sitemaps
1. **sitemap.xml** - Main sitemap index
2. **sitemap-news.xml** - News articles sitemap (Google News compatible)
3. **sitemap-blog.xml** - Blog posts sitemap
4. **sitemap-pages.xml** - Static pages sitemap

### Sitemap Features
- **News Sitemap**: Includes Google News schema with publication dates, titles, and keywords
- **Priority Levels**: Homepage (1.0), News/Blog (0.9), About/Timeline (0.7)
- **Change Frequency**: News (hourly), Blog (daily), Pages (monthly)

## Robots.txt Configuration

### Crawl Directives
```
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/
Disallow: /api/
Disallow: /*.json$
Disallow: /*.xml$
```

### Bot-Specific Rules
- **Googlebot**: Crawl-delay: 0.5
- **Bingbot**: Crawl-delay: 0.5
- **Baiduspider**: Crawl-delay: 2
- **Yandex**: Crawl-delay: 1

## Meta Tags & SEO Components

### Primary Meta Tags
- **Title**: NewAI News - Latest AI Technology News & Trends | DeepSeek, OpenAI GPT-5, ChatGPT, Claude, Gemini
- **Description**: Get breaking AI news on DeepSeek, OpenAI GPT-5, ChatGPT, Claude, Gemini, Llama and Meta AI
- **Keywords**: ai news, newainews, deepseek, openai gpt-5, chatgpt, claude, gemini, llama, meta ai

### Open Graph Tags
- og:type, og:title, og:description, og:image, og:url, og:site_name
- Twitter Card: summary_large_image

### Structured Data
- **Organization Schema**: NewsMediaOrganization with social profiles
- **Article Schema**: NewsArticle for individual articles
- **Website Schema**: SearchAction for site search

## SEO Components

### SEO.tsx Component
Located at `src/components/SEO.tsx`:
- Dynamic meta tag generation
- Structured data JSON-LD
- Article-specific meta tags
- Social media optimization

### Usage Example
```tsx
<SEO
  title="Article Title"
  description="Article description"
  keywords="keyword1, keyword2"
  canonical="https://newainews.com/article-slug"
  ogType="article"
  articlePublishedTime="2024-01-15T08:00:00Z"
  articleAuthor="Author Name"
  articleTags={['AI', 'Machine Learning']}
/>
```

## Search Engine Verification

### Google Search Console
- Verification file: `public/google-site-verification.html`
- Meta tag: `<meta name="google-site-verification" content="your-code" />`

### Bing Webmaster Tools
- Verification file: `public/BingSiteAuth.xml`
- Meta tag: `<meta name="msvalidate.01" content="your-code" />`

## Key SEO Features

### 1. Keyword Optimization
- Primary: ai news, newainews
- Secondary: deepseek, openai gpt-5, chatgpt, claude, gemini, llama, meta ai
- Tertiary: artificial intelligence, machine learning, large language models

### 2. Technical SEO
- Canonical URLs
- Robot meta directives
- Image optimization directives
- Video preview optimization

### 3. Content SEO
- News-specific markup
- Article metadata
- Author attribution
- Category and tag organization

## Implementation Notes

### File Locations
- Sitemaps: `public/sitemap*.xml`
- Robots: `public/robots.txt`
- Verification: `public/google-site-verification.html`, `public/BingSiteAuth.xml`
- SEO Component: `src/components/SEO.tsx`
- Configuration: `src/config/seo.json`

### Next Steps
1. Replace verification codes with actual codes from search consoles
2. Update sitemap lastmod dates as content changes
3. Add more articles to blog sitemap
4. Monitor search console for indexing status

## Monitoring & Maintenance

### Regular Checks
- Verify sitemap submission in search consoles
- Monitor crawl errors
- Check indexing status
- Review search analytics

### Update Frequency
- Sitemaps: Update lastmod dates weekly
- News articles: Add to sitemap-news.xml immediately upon publication
- Blog posts: Add to sitemap-blog.xml upon publication

This SEO optimization provides comprehensive coverage for Google, Bing, and other search engines, with special attention to news search optimization.