import { useState, useEffect } from 'react';

interface BackToTopButtonProps {
  threshold?: number;
  className?: string;
}

const BackToTopButton = ({ threshold = 100, className = '' }: BackToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 right-5 w-10 h-10 p-4 z-50 bg-primary text-white flex items-center justify-center rounded-full md:bottom-6 md:right-6 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      } ${className}`}
      aria-label="返回顶部"
    >
       <span className="text-1xl">▲</span>
    </button>
  );
};

export default BackToTopButton;