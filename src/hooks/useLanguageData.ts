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
  const { getDataPath } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dataPath = getDataPath(fileName);
        
        // 动态导入数据文件
        const module = await import(/* @vite-ignore */ dataPath);
        setData(module.default || module);
      } catch (err) {
        console.error(`Failed to load data from ${fileName}:`, err);
        setError(`Failed to load ${fileName}`);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getDataPath, fileName]);

  return { data, loading, error };
};

export default useLanguageData;