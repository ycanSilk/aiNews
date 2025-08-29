import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseLanguageDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useLanguageData = <T,>(fileName: string): UseLanguageDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 构建完整的文件路径
        const languageDir = currentLanguage === 'cn' ? 'cn' : 'en';
        const fullPath = `/src/data/local/${languageDir}/${fileName}`;
        
        // 使用fetch API获取JSON数据
        const response = await fetch(fullPath);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        console.error(`Failed to load data from ${fileName}:`, err);
        setError(`Failed to load ${fileName}`);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLanguage, fileName]);

  return { data, loading, error };
};

export default useLanguageData;