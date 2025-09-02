import React from 'react';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ArticlePage: React.FC = () => {
  return (
    <div className="article-page">
      <Header />
      <ArticleList />
      <Footer />
    </div>
  );
};

export default ArticlePage;