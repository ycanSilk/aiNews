import React, { useState, useEffect } from 'react';
import { BlogData } from '@/types/blog';
import blogData from './blog.json';
import '@/components/timeline/Timeline.css';

interface BlogListProps {
  lang: string;
}

const BlogList: React.FC<BlogListProps> = ({ lang }) => {
  const blogs: BlogData[] = blogData;
  const loading = false;
  const error = null;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);

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
    setCurrentPage(1); // 切换分类时重置到第一页
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // 过滤并按时间降序排序博客数据
  const filteredBlogs = blogs
    .filter(blog => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === '' || 
        blog.title.toLowerCase().includes(searchTermLower) ||
        blog.summary.toLowerCase().includes(searchTermLower) ||
        blog.content.toLowerCase().includes(searchTermLower) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTermLower)) ||
        blog.seoKeywords.some(keyword => keyword.toLowerCase().includes(searchTermLower));
      
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 分页计算
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#039797]"></div>
          <span className="ml-3 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-5">
      <div className="flex flex-col items-center">
        <div className='bg-white shadow-md border border-gray-200 w-full py-5 px-4 sm:px-6 lg:px-8'>
          {/* Header */}
          <header className="">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-shadow text-center" >
              Newainews Blog
            </h1>
            <p className="text-base sm:text-lg lg:text-xl opacity-90 max-w-3xl mx-auto text-center">
              Explore the latest AI technologies and industry trends
            </p>
          </header>
          
          {/* Search Box */}
          <div className="py-6 bg-white">
            <div className="search-box">
              <div className="search-input-group">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search blogs by title, content, tags..."
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="hot-search-tags">
                <span>Hot searches:</span>
                {['ALL', 'DeepSeek', 'OpenAI', 'ChatGPT', 'Machine Learning'].map((tag, index) => (
                  <span 
                    key={index} 
                    className="hot-tag"
                    onClick={() => {
                      setSearchTerm(tag);
                      handleSearch();
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="w-full my-6 sm:my-8">
          <p className="text-center text-gray-600 text-sm sm:text-base">
            {filteredBlogs.length} {filteredBlogs.length === 1 ? 'blog' : 'blogs'} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
        

           {/* Blogs Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full space-y-4 sm:space-y-6">
          {currentBlogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No blogs found
              </h3>
              <p className="text-gray-500">
                0 articles in {selectedCategory === 'All' ? 'all categories' : selectedCategory}
              </p>
            </div>
          ) : (
            currentBlogs.map((blog: BlogData) => (
              <div
                key={blog._id}
                className="bg-white shadow-md hover:shadow-xl hover:bg-green-50 transition-all duration-300 overflow-hidden cursor-pointer rounded-lg mb-4 sm:mb-6 group"
                 onClick={() => handleBlogClick(blog.blogUrl)}
              >
                {/* Blog Header */}
                <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 flex flex-col md:flex-row items-start gap-4">
                
                  {/* Blog Info */}
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {blog.title || 'No Title'}
                </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                      {blog.summary || 'No summary available'}
                    </p>
                    <div className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-3">
                      {blog.content ? blog.content.replace(/<[^>]*>/g, '') : 'No content available'}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center flex-wrap">
                      <span>{formatDate(blog.createdAt || '')}</span>
                      <span className="mx-2">•</span>
                      <span className="text-blue-600">{blog.views || 0} views</span>
                    </div>
                    
                    {/* Blog Tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full cursor-pointer hover:bg-[#039797] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchTerm(tag);
                            handleSearch();
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-8 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm md:text-base"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 border rounded-md text-sm md:text-base ${
                    currentPage === page
                      ? 'bg-[#039797] text-white border-[#039797]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm md:text-base"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;