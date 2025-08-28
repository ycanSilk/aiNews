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
  const [currentLanguage, setCurrentLanguage] = useState('ch');

  useEffect(() => {
    // 根据路由路径确定当前语言
    if (location.pathname.startsWith('/en')) {
      setCurrentLanguage('en');
    } else {
      setCurrentLanguage('ch');
    }
  }, [location.pathname]);

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    // 根据语言跳转到对应路由
    if (lang === 'en') {
      navigate('/en');
    } else {
      navigate('/');
    }
  };

  const getDataPath = (fileName: string): string => {
    return `/src/data/${currentLanguage}/${fileName}`;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, getDataPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;