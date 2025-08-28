import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useLanguageData } from '@/hooks/useLanguageData';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  // 使用语言数据钩子加载分类数据
  const { data: categoryData, loading, error } = useLanguageData<any>('categories.json');
  
  // 使用分类数据
  const allCategories = categoryData?.newsCategories?.map((cat: any) => cat.name) || [];

  return (
    <div className=" bg-white shadow-sm">
      <Tabs 
        defaultValue="全部" 
        value={activeCategory} 
        onValueChange={onCategoryChange} 
        className="w-full"
      >
        <div className="container mx-auto px-4 py-4 flex items-center">
          <TabsList className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap justify-start md:justify-center py-2 px-1 rounded-none bg-transparent space-x-4 md:space-x-6 text-black">
            {allCategories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="rounded-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary text-lg"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;