import React from 'react';
import ArticleTemplate from '@/components/articleLite/ArticleTemplate';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlesListPageCh: React.FC = () => {
  return (
    <div className="articles-list-page">
      <Header />
      <ArticleTemplate />
      <Footer />
    </div>
  );
};

export default ArticlesListPageCh;