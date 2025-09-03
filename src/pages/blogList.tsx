import React from 'react';
import BlogList from "@/components/blogList/blogList";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BlogPage: React.FC = () => {
  return (
    <div className="Blog-page">
      <Header />
      <BlogList lang="en" />
      <Footer />
    </div>
  );
};

export default BlogPage;