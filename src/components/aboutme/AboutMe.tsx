import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const AboutMe = () => {
  const { currentLanguage } = useLanguage();
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    // 动态导入JSON文件
    import(`../../data/${currentLanguage}/aboutMe.json`)
      .then(module => setData(module.default))
      .catch(error => console.error('Failed to load aboutMe data:', error));
  }, [currentLanguage]);
  
  if (!data) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{data.pageTitle.title}</h1>
          <p className="text-lg text-gray-600">
            {data.pageTitle.description}
          </p>
        </div>

        {/* 核心特色 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{data.coreFeatures.title}</h2>
          
          <div className="space-y-6">
            {data.coreFeatures.features.map((feature: any, index: number) => (
              <div key={index} className={`border-l-4 pl-4 ${getBorderColor(index)}`}>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{feature.title}</h3>
                <ul className="text-gray-700 space-y-1">
                  {feature.items.map((item: string, itemIndex: number) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 对比优势 */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{data.comparisonAdvantages.title}</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                 <tr className="bg-gray-50">
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {data.comparisonAdvantages.table[0]?.feature || 'Feature'}
                   </th>
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {data.comparisonAdvantages.table[0]?.aiPlatform || 'AI News Platform'}
                   </th>
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {data.comparisonAdvantages.table[0]?.traditionalPlatform || 'Traditional Information Platform'}
                   </th>
                 </tr>
               </thead>
              <tbody className="divide-y divide-gray-200">
                {data.comparisonAdvantages.table.map((row: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {row.aiPlatform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.traditionalPlatform}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </section>
      </div>
    </div>
  );
};

// 辅助函数：根据索引获取边框颜色
const getBorderColor = (index: number) => {
  const colors = [
    'border-blue-500',
    'border-green-500',
    'border-purple-500',
    'border-orange-500',
    'border-red-500',
    'border-indigo-500'
  ];
  return colors[index % colors.length];
};

export default AboutMe;