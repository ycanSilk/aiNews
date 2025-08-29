import React from 'react';
import ArticleComponent from '@/components/articleLite/ArticleComponent';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlePage: React.FC = () => {
  return (
    <div className="article-page">
      <Header />
      <ArticleComponent />
      <Footer />
    </div>
  );
};

export default ArticlePage;