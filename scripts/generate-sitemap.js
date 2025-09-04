import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 配置
const SITE_URL = 'https://newainews.com';
const CURRENT_DATE = '2025-08-01';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_DIR = path.join(__dirname, '..', 'public');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 生成主sitemap.xml
function generateMainSitemap() {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Home Page -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Blog Page -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- News Page -->
  <url>
    <loc>${SITE_URL}/news</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Timeline Page -->
  <url>
    <loc>${SITE_URL}/timeline</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Sitemap Index Files -->
  <url>
    <loc>${SITE_URL}/sitemap-news.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </url>

  <url>
    <loc>${SITE_URL}/sitemap-blog.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </url>

  <url>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
  </url>

</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), xmlContent, 'utf8');
  console.log('✓ Main sitemap.xml generated');
}

// 生成页面sitemap
function generatePagesSitemap() {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Static Pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_URL}/news</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>${SITE_URL}/timeline</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-pages.xml'), xmlContent, 'utf8');
  console.log('✓ Pages sitemap generated');
}

// 生成博客sitemap
function generateBlogSitemap() {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Blog Articles -->
  <url>
    <loc>${SITE_URL}/blog/how-to-start-learning-ai</loc>
    <lastmod>2025-08-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Additional blog articles can be added here as they are created -->
  <!-- Example structure for future blog posts:
  <url>
    <loc>${SITE_URL}/blog/your-blog-post-slug</loc>
    <lastmod>YYYY-MM-DD</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  -->

</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-blog.xml'), xmlContent, 'utf8');
  console.log('✓ Blog sitemap generated');
}

// 验证XML格式
function validateXML(xmlContent) {
  try {
    // 简单的XML验证
    if (!xmlContent.includes('<?xml version="1.0"')) {
      throw new Error('Missing XML declaration');
    }
    if (!xmlContent.includes('encoding="UTF-8"')) {
      throw new Error('Missing UTF-8 encoding');
    }
    return true;
  } catch (error) {
    console.error('XML validation failed:', error.message);
    return false;
  }
}

// 主执行函数
function main() {
  try {
    console.log('Generating sitemaps...');
    
    generateMainSitemap();
    generatePagesSitemap();
    generateBlogSitemap();
    
    // 验证生成的文件
    const files = ['sitemap.xml', 'sitemap-pages.xml', 'sitemap-blog.xml'];
    files.forEach(file => {
      const content = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');
      if (validateXML(content)) {
        console.log(`✓ ${file} validated successfully`);
      }
    });
    
    console.log('\n✅ All sitemaps generated successfully!');
    console.log('📁 Files are saved in:', OUTPUT_DIR);
    
  } catch (error) {
    console.error('❌ Error generating sitemaps:', error.message);
    process.exit(1);
  }
}

// 执行
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateMainSitemap, generatePagesSitemap, generateBlogSitemap };