import React from 'react';

interface AboutMeConfig {
  pageTitle: {
    title: string;
    description: string;
  };
  coreFeatures: {
    title: string;
    features: Array<{
      title: string;
      items: string[];
    }>;
  };
  comparisonAdvantages: {
    title: string;
    table: Array<{
      feature: string;
      aiPlatform: string;
      traditionalPlatform: string;
    }>;
  };
}

interface AboutMeProps {
  config: AboutMeConfig;
}

const AboutMe: React.FC<AboutMeProps> = ({ config }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{config.pageTitle.title}</h1>
          <p className="text-lg text-gray-600">
            {config.pageTitle.description}
          </p>
        </div>

        {/* 核心特色 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{config.coreFeatures.title}</h2>
          
          <div className="space-y-6">
            {config.coreFeatures.features.map((feature, index) => (
              <div key={index} className={`border-l-4 pl-4 ${getBorderColor(index)}`}>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{feature.title}</h3>
                <ul className="text-gray-700 space-y-1">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 对比优势 */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{config.comparisonAdvantages.title}</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                 <tr className="bg-gray-50">
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {config.comparisonAdvantages.table[0]?.feature || 'Feature'}
                   </th>
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {config.comparisonAdvantages.table[0]?.aiPlatform || 'AI News Platform'}
                   </th>
                   <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                     {config.comparisonAdvantages.table[0]?.traditionalPlatform || 'Traditional Information Platform'}
                   </th>
                 </tr>
               </thead>
              <tbody className="divide-y divide-gray-200">
                {config.comparisonAdvantages.table.map((row, index) => (
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