import React from 'react';
import ArticleList from '@/components/articleList/ArticleList';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlesListPage: React.FC = () => {
  return (
    <div className="articles-list-page">
      <Header />
      <ArticleList lang="ch" />
      <Footer />
    </div>
  );
};

export default ArticlesListPage;
