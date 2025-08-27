import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

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
  // 添加一个"全部"选项在最前面
  const allCategories = ["全部", ...categories];

  return (
    <div className="py-4  bg-white shadow-sm">
      <Tabs 
        defaultValue="全部" 
        value={activeCategory} 
        onValueChange={onCategoryChange} 
        className="w-full"
      >
        <div className="container mx-auto ">
          <TabsList className="w-full justify-start py-2 px-1 rounded-none bg-transparent space-x-6 text-black">
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