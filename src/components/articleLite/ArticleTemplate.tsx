import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import articleData from '@/data/content/articles.json';

interface Article {
  id: string;
  coverImage: string;
  title: {
    ch: string;
    en: string;
  };
  author: {
    ch: string;
    en: string;
  };
  date: string;
  content: {
    ch: string;
    en: string;
  };
  highlight: {
    ch: string;
    en: string;
  };
  tags: string[];
}

interface ArticleData {
  pageTitle: {
    ch: string;
    en: string;
  };
  subtitle: {
    ch: string;
    en: string;
  };
  articles: Article[];
  footerText: {
    ch: string;
    en: string;
  };
}

const ArticleTemplate: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const data = articleData as ArticleData;

  const getLocalizedText = (text: { ch: string; en: string }) => {
    return text[currentLanguage === 'ch' ? 'ch' : 'en'];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return currentLanguage === 'ch' 
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const toggleArticle = (id: string) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto overflow-hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-shadow">
            {getLocalizedText(data.pageTitle)}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {getLocalizedText(data.subtitle)}
          </p>
        </header>

        {/* Articles Container */}
        <div className="p-8 space-y-6">
          {data.articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => toggleArticle(article.id)}
            >
              {/* Article Header */}
              <div className="p-6 flex flex-col md:flex-row items-start gap-6">
                {/* Cover Image */}
                <div
                  className="w-full md:w-32 h-32 bg-cover bg-center rounded-lg flex-shrink-0"
                  style={{ backgroundImage: `url(${article.coverImage})` }}
                />

                {/* Article Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors">
                    {getLocalizedText(article.title)}
                  </h2>
                  <div className="text-gray-600 text-sm mb-4">
                    <span>{getLocalizedText(article.author)}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(article.date)}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  expandedArticle === article.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="border-t pt-6">
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                      {getLocalizedText(article.content)}
                    </p>

                    {/* Highlight */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                      <p className="text-blue-800 italic">
                        "{getLocalizedText(article.highlight)}"
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white p-6 text-center">
          <p className="text-sm">
            {getLocalizedText(data.footerText)}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ArticleTemplate;