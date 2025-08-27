import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

interface DateFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

const DateFilter = ({ onDateRangeChange }: DateFilterProps) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  
  // 创建ref用于检测点击外部
  const dropDownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  // 处理预设日期范围选择
  const handlePresetRange = (days: number | null) => {
    if (days === null) {
      // 全部
      setStartDate("");
      setEndDate("");
      onDateRangeChange(null, null);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);
      
      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];
      
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      onDateRangeChange(startDateStr, endDateStr);
    }
    setShowDropDown(false);
  };

  // 处理自定义日期范围选择
  const handleCustomRange = () => {
    if (startDate && endDate) {
      // 检查日期范围是否在90天以内
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 90) {
        onDateRangeChange(startDate, endDate);
      } else {
        alert('日期范围不能超过90天');
      }
    }
    setShowCalendar(false);
  };

  // 清除日期筛选
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    onDateRangeChange(null, null);
    setShowCalendar(false);
  };

  // 切换下拉菜单显示
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
    setShowCalendar(false);
  };

  // 切换日历显示
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowDropDown(false);
  };

  // 监听点击事件，实现点击外部关闭菜单和日历
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 如果点击的是下拉菜单按钮或日历按钮，不关闭
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      if (calendarButtonRef.current && calendarButtonRef.current.contains(event.target as Node)) {
        return;
      }
      
      // 如果点击的是下拉菜单内容，不关闭
      if (dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
        return;
      }
      
      // 如果点击的是日历内容，不关闭
      if (calendarRef.current && calendarRef.current.contains(event.target as Node)) {
        return;
      }
      
      // 点击外部，关闭下拉菜单和日历
      setShowDropDown(false);
      setShowCalendar(false);
    };
    
    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
      {/* 下拉菜单按钮 */}
      <p className="text-2xl ">请选择显示新闻的日期：</p>
      <div className="relative">
  
        <Button 
          variant="default" 
          className="rounded-none bg-primary hover:bg-primary-hover flex items-center gap-2"
          onClick={toggleDropDown}
          ref={buttonRef}
        >
          日期范围
          <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: showDropDown ? 'rotate(180deg)' : 'rotate(0)' }} />
        </Button>
        
        {/* 下拉菜单内容 */}
        {showDropDown && (
          <div ref={dropDownRef} className="absolute top-full left-0 mt-1 w-48 bg-background border border-border shadow-lg z-10">
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(null)}
            >
              全部
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(3)}
            >
              最近三天
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(7)}
            >
              最近一周
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(15)}
            >
              最近半月
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(30)}
            >
              最近一个月
            </button>
          </div>
        )}
      </div>
      
      {/* 日历选择按钮 */}
      <div className="relative">
        <Button 
          variant="default" 
          className="rounded-none bg-primary hover:bg-primary-hover flex items-center gap-2"
          onClick={toggleCalendar}
          ref={calendarButtonRef}
        >
          <Calendar className="w-4 h-4" />
          选择日期范围
        </Button>
        
        {/* 日历选择器 */}
        {showCalendar && (
          <div ref={calendarRef} className="absolute top-full left-0 mt-1 p-4 bg-background border border-border shadow-lg z-10">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-border rounded-none p-2 text-sm w-full md:w-40"
                placeholder="开始日期"
              />
              <span className="text-sm whitespace-nowrap">至</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-border rounded-none p-2 text-sm w-full md:w-40"
                placeholder="结束日期"
              />
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-none bg-primary hover:bg-primary-hover h-9 px-3 w-full md:w-auto"
                onClick={handleCustomRange}
              >
                应用
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              注：最大选择范围为90天
            </div>
          </div>
        )}
      </div>
      
      {/* 当前筛选状态显示 */}
      {startDate && endDate && !showCalendar && !showDropDown && (
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          已筛选: {startDate} 至 {endDate}
          <button 
            className="ml-2 text-primary hover:underline"
            onClick={handleClear}
          >
            清除
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;