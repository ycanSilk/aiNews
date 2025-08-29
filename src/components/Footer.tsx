import { Github, Twitter, Mail, Rss } from "lucide-react";
import { useLanguageData } from '@/hooks/useLanguageData';

const Footer = () => {
  // 使用语言数据钩子加载页脚配置数据
  const { data: indexData, loading, error } = useLanguageData<any>('index.json');
  // 加载状态显示
  if (loading) {
    return (
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-background/70">加载中...</p>
        </div>
      </footer>
    );
  }

  // 错误状态显示
  if (error) {
    return (
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-background/70">加载失败: {error}</p>
        </div>
      </footer>
    );
  }

  // 使用配置数据或默认值
  const footerConfig = indexData?.footer || {};
  const {
    title = 'AI新闻资讯',
    description = '专注于人工智能领域的最新动态',
    copyright = '© 2024 AI新闻资讯. 保留所有权利.'
  } = footerConfig;

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {/* Logo and Description */}
          <div className="space-y-4 md:space-y-6 flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">AI</span>
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
            </div>
            <p className="text-background/70 text-sm">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">{footerConfig.quickLinksTitle || '快速链接'}</h4>
            <ul className="space-y-2 text-sm">
              {footerConfig.quickLinks?.map((link: any, index: number) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </a>
                </li>
              )) || (
                <>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">首页</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">科技新闻</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">机器学习</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">深度学习</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4 text-center">{footerConfig.categoriesTitle || '分类'}</h4>
            <ul className="space-y-2 text-sm">
              {footerConfig.categories?.map((category: any, index: number) => (
                <li key={index}>
                  <a href={category.href} className="text-background/70 hover:text-background transition-colors">
                    {category.label}
                  </a>
                </li>
              )) || (
                <>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">大语言模型</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">计算机视觉</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors ">自动驾驶</a></li>
                  <li><a href="#" className="text-background/70 hover:text-background transition-colors">医疗AI</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center">
            <h4 className="font-semibold mb-4">{footerConfig.socialTitle || '关注我们'}</h4>
            <div className="flex justify-center md:justify-start">
              {footerConfig.socialLinks?.map((social: any, index: number) => (
                <a key={index} href={social.href} className="text-background/70 hover:text-background transition-colors">
                 <span>{social.platform === 'Email' && <Mail className="w-5 h-5" />} {social.platform === 'Email' && 'gg2235676091@gmail.com'}</span> 
                </a>
              )) || (
                <>
                  <a href="#" className="text-background/70 hover:text-background transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center">
          <p className="text-background/70 text-sm">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;