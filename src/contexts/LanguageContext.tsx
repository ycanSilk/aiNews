import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  getDataPath: (fileName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('cn');

  useEffect(() => {
    // 根据路由路径确定当前语言
    if (location.pathname.startsWith('/en')) {
      setCurrentLanguage('en');
    } else {
      setCurrentLanguage('cn');
    }
  }, [location.pathname]);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    // 根据当前路径智能切换到对应语言版本的相同页面
    const currentPath = location.pathname;
    let targetPath = currentPath;
    
    if (lang === 'en') {
      // 切换到英文版
      if (currentPath.startsWith('/cn/')) {
        targetPath = currentPath.replace('/cn/', '/en/');
      } else if (currentPath === '/cn') {
        targetPath = '/en';
      } else if (!currentPath.startsWith('/en/') && currentPath !== '/en') {
        targetPath = '/en';
      }
    } else {
      // 切换到中文版
      if (currentPath.startsWith('/en/')) {
        targetPath = currentPath.replace('/en/', '/cn/');
      } else if (currentPath === '/en') {
        targetPath = '/cn';
      } else if (!currentPath.startsWith('/cn/') && currentPath !== '/cn') {
        targetPath = '/cn';
      }
    }
    
    navigate(targetPath);
  };

  const getDataPath = (fileName: string): string => {
    // 映射语言代码到实际目录名：'ch' -> 'cn', 'en' -> 'en'
    const languageDir = currentLanguage === 'cn' ? 'cn' : currentLanguage;
    // 使用相对路径，Vite会自动处理src目录下的文件
    return `../../data/locales/${languageDir}/${fileName}`;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, getDataPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;