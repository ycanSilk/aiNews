import { useState, useEffect } from 'react';

interface UseMongoDBDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useMongoDBData = <T,>(
  endpoint: string,
  queryParams?: Record<string, string | number | boolean>
): UseMongoDBDataResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 构建查询参数
      const params = new URLSearchParams();
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
      }
      
      const url = `/api/v1/${endpoint}${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      // 处理不同的API响应格式：有些API返回{data: T}，有些直接返回T
      setData(result.data !== undefined ? result.data : result);
    } catch (err) {
      console.error(`Failed to fetch data from ${endpoint}:`, err);
      setError(`Failed to load data from ${endpoint}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint, JSON.stringify(queryParams)]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useMongoDBData;