import React from 'react';

const AboutMe: React.FC = () => {
  const config = {
    "pageTitle": {
      "title": "About AI News",
      "description": "A professional platform focused on the latest news, in-depth analysis, and original content in the field of artificial intelligence"
    },
    "websiteFeatures": {
      "title": "Website Features",
      "items": [
        {
          "title": "Daily Updates",
          "content": "Bringing you the latest global AI news and industry trends daily, ensuring information timeliness"
        },
        {
          "title": "In-Depth Original Content",
          "content": "Providing high-quality original blog articles that deeply analyze AI technology development and application scenarios"
        },
        {
          "title": "Timeline Feature",
          "content": "A unique timeline display that allows you to clearly understand the development history and important milestones of AI"
        }
      ]
    },
    "services": {
      "title": "Services Provided",
      "items": [
        {
          "icon": "📰",
          "title": "AI News Information",
          "description": "Covering the latest advancements in AI subfields such as machine learning, deep learning, and natural language processing"
        },
        {
          "icon": "✍️",
          "title": "Original Blog Articles",
          "description": "In-depth technical analysis and industry insight articles written by a professional team"
        },
        {
          "icon": "📊",
          "title": "Technology Timeline",
          "description": "Visual display of the development history and important breakthrough points of artificial intelligence technology"
        }
      ]
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#039797] mb-4">{config.pageTitle.title}</h2>
          <p className="text-lg text-gray-600">
            {config.pageTitle.description}
          </p>
        </div>

        {/* 网站特色 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{config.websiteFeatures.title}</h2>
          
          <div className="space-y-6">
            {config.websiteFeatures.items.map((item, index) => (
              <div key={index} className={`border-l-4 pl-4 ${getBorderColor(index)}`}>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 提供的服务 */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{config.services.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.services.items.map((item, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-white hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            ))}
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