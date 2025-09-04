import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleSection?: string;
  articleTags?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'New AI News - Latest AI Technology News & Trends',
  description = 'Get the latest AI news and technology trends from New AI News. Breaking news on DeepSeek, OpenAI GPT-5, Claude, and more artificial intelligence developments.',
  keywords = 'ai news, newainews, deepseek, chatgpt, gemini llama meta artificial intelligence, ai technology news',
  canonical = 'https://newainews.com',
  ogImage = 'https://newainews.com/og-image.png',
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
  articleTags = []
}) => {
  const fullTitle = title.includes('NewAI News') ? title : `${title} | NewAI News`;
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ogType === 'article' ? 'NewsArticle' : 'WebSite',
    ...(ogType === 'article' && {
      headline: fullTitle,
      description: description,
      image: ogImage,
      datePublished: articlePublishedTime,
      dateModified: articleModifiedTime,
      author: {
        '@type': 'Person',
        name: articleAuthor || 'NewAI News'
      },
      publisher: {
        '@type': 'NewsMediaOrganization',
        name: 'NewAI News',
        logo: {
          '@type': 'ImageObject',
          url: 'https://newainews.com/logo.png'
        }
      },
      ...(articleSection && { articleSection }),
      ...(articleTags.length > 0 && { keywords: articleTags.join(', ') })
    }),
    ...(ogType === 'website' && {
      name: 'NewAI News',
      url: 'https://newainews.com',
      description: description,
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://newainews.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    })
  };

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="NewAI News" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="NewAI News" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@newainews" />
      <meta name="twitter:creator" content="@newainews" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Article-specific meta tags */}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {articleSection && (
        <meta property="article:section" content={articleSection} />
      )}
      {articleTags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
};

export default SEO;