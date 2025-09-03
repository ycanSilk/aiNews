import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Category } from "../types/news";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  // 添加'All'选项到分类列表
  const allCategories = ['All', ...categories.map(cat => cat.name).filter(name => name !== 'All')];

  return (
    <div className=" bg-white shadow-sm">
      <Tabs 
        defaultValue="All" 
        value={activeCategory} 
        onValueChange={onCategoryChange} 
        className="w-full"
      >
        <div className="container mx-auto px-4 py-4 flex items-center">
          <TabsList className="w-full overflow-x-auto overflow-y-hidden whitespace-nowrap justify-start md:justify-center py-2 px-1 rounded-none bg-transparent space-x-4 md:space-x-6 text-black">
            {allCategories.map((category, index) => (
              <TabsTrigger 
                key={`${category}-${index}`} 
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