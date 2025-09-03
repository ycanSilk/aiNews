import React, { useState } from 'react';
import { BlogData } from '@/types/blog.json';
import blogData from './blog.json';

interface BlogListProps {
  lang: string;
}

const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const blogs: BlogData[] = [blogData];
  const loading = false;
  const error = null;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleBlogClick = (blogUrl: string) => {
    if (blogUrl) {
      window.open(blogUrl, '_blank');
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading blogs...
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

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No blogs available
          </h2>
          <p className="text-gray-600">
            There are currently no blogs to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="flex flex-col items-center ">
        <div className='bg-white shadow-md border border-gray-200 w-full mb-10'>
                  {/* Header */}
          <header className="">
          <h1 className="text-4xl font-bold mb-4 text-shadow text-center pt-10 pb-5" >
            AI News Deep Analysis
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto text-center mb-5">
            Explore the latest AI technologies and industry trends
          </p>
          </header>
          {/* Category Filter */}
          <div className="p-6 bg-white">
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'All' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('All')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'AI Technology' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('AI Technology')}
              >
                AI Technology
              </button>
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'Machine Learning' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('Machine Learning')}
              >
                Machine Learning
              </button>
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'Deep Learning' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('Deep Learning')}
              >
                Deep Learning
              </button>
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'NLP' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('NLP')}
              >
                NLP
              </button>
              <button 
                className={`px-4 py-2 border border-gray-400 rounded-full transition-colors ${
                  selectedCategory === 'Computer Vision' 
                    ? 'bg-[#039797] text-white' 
                    : 'bg-white text-gray-700 hover:bg-[#039797] hover:text-white'
                }`}
                onClick={() => handleCategoryClick('Computer Vision')}
              >
                Computer Vision
              </button>
            </div>
          </div>
        </div>
        

           {/* Blogs Container */}
        <div className="flex-1 p-10 border w-full ">
          {blogs.map((blog: BlogData) => (
            <div
              key={blog._id}
              className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleBlogClick(blog.blogUrl)}
            >
              {/* Blog Header */}
              <div className="px-10 py-5 flex flex-col md:flex-row items-start gap-4">
              
                {/* Blog Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {blog.title || 'No Title'}
                  </h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {blog.summary || 'No summary available'}
                  </p>
                  <div className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {blog.content ? blog.content.replace(/<[^>]*>/g, '') : 'No content available'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span>{formatDate(blog.createdAt || '')}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.views || 0} views</span>
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

export default BlogList;