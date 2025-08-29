import React, { useState, useEffect } from 'react';
import { useLanguageData } from '../../hooks/useLanguageData';
import './ArticleComponent.css';

interface Article {
  id: number;
  coverImage: string;
  title: string;
  author: string;
  date: string;
  content: string[];
  highlight: string;
  tags: string[];
}

interface ArticleData {
  pageTitle: string;
  subtitle: string;
  articles: Article[];
  footerText: string;
}

const ArticleComponent: React.FC = () => {
  const { data, loading, error } = useLanguageData<ArticleData>('article.json');

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

export default ArticleComponent;