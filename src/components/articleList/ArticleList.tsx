import React, { useState } from 'react';
import { ArticleData } from '@/types/article';
import articleData from './article.json';

interface ArticleListProps {
  lang: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ lang }) => {
  const articles: ArticleData[] = [articleData];
  const loading = false;
  const error = null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'ch' ? 'zh-CN' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleArticleClick = (blogUrl: string) => {
    if (blogUrl) {
      window.open(blogUrl, '_blank');
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading articles...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading failed
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No articles available
          </h2>
          <p className="text-gray-600">
            There are currently no articles to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 w-full">
      <div className="max-w-6xl mx-auto overflow-hidden flex flex-col items-start min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-shadow">
            AI News Deep Analysis
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Explore the latest AI technologies and industry trends
          </p>
        </header>

        {/* Category Filter */}
        <div className="p-6 bg-white border-b mb-10">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              All
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              AI Technology
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Machine Learning
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Deep Learning
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              NLP
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
              Computer Vision
            </button>
          </div>
        </div>

        {/* Articles Container */}
        <div className="flex-1 w-full">
          {articles.map((article: ArticleData) => (
            <div
              key={article._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleArticleClick(article.blogUrl)}
            >
              {/* Article Header */}
              <div className="p-4 flex flex-col md:flex-row items-start gap-4">
                {/* Cover Image */}
                <div
                  className="w-full md:w-32 h-32 bg-cover bg-center rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url(${article.coverImage})` }}
                />

                {/* Article Info */}
                <div className="flex-1">
                  <h2 className="">
                    {article.title || 'No Title'}
                  </h2>
                  <p className="">
                    {article.summary || 'No summary available'}
                  </p>
                  <div className="">
                    {article.content ? article.content.replace(/<[^>]*>/g, '') : 'No content available'}
                  </div>
                  <div className="">
                    <span>{formatDate(article.createdAt || '')}</span>
                    <span className="mx-2">•</span>
                    <span>{article.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleList;