import React from 'react';
import { useArticleData } from '../../hooks/useArticleData';
import { ArticleData } from './ArticleComponent';
import './ArticleComponent.css';

interface ArticleComponentDBProps {
  lang?: string;
}

const ArticleComponentDB: React.FC<ArticleComponentDBProps> = ({ lang = 'zh' }) => {
  const { data, loading, error } = useArticleData(lang);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div className="error">No data available</div>;
  }

  return (
    <div className="article-container my-10">
      <header className="article-header">
        <h1>{data.pageTitle}</h1>
        <p className="subtitle">{data.subtitle}</p>
      </header>

      <div className="blog-container">
        {data.articles.map((article) => (
          <div key={article.id} className="blog-post">
            <div className="post-header">
              <div 
                className="post-cover"
                style={{ backgroundImage: `url(${article.coverImage})` }}
              />
              <div>
                <h2 className="post-title">{article.title}</h2>
                <div className="post-meta">
                  <span>作者: {article.author} | {article.date}</span>
                </div>
              </div>
            </div>
            <div className="post-content">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              
              <div className="highlight">
                "{article.highlight}"
              </div>
              
              <div className="tags">
                {article.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleComponentDB;