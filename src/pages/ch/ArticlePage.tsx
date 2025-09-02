import React from 'react';
import ArticleComponentDB from '@/components/articleLite/ArticleComponentDB';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlePage: React.FC = () => {
  return (
    <div className="article-page">
      <Header />
      <ArticleComponentDB lang="ch" />
      <Footer />
    </div>
  );
};

export default ArticlePage;