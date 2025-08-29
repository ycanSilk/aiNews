import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { useMongoDBData } from '@/hooks/useMongoDBData';
import { useLanguage } from '@/contexts/LanguageContext';
import CalendarCN from './CalendarCN';
import CalendarEN from './CalendarEN';

interface DateFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  onRangeTextChange?: (rangeText: string) => void;
}

const DateFilter = ({ onDateRangeChange, onRangeTextChange }: DateFilterProps) => {
  // 使用MongoDB API获取配置数据
  const { data: indexData } = useMongoDBData<any>('index');
  const { currentLanguage } = useLanguage();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<string>("最近一周");
  
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
      const allText = indexData?.newsSection?.allText || '全部';
      setSelectedRange(allText);
 
      onDateRangeChange(null, null);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days + 1); // +1 确保包含起始日期
      
      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];
      
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      
      // 设置选中的范围文本
      let rangeText = '';
      if (days === 3) rangeText = indexData?.newsSection?.last3DaysText || '最近三天';
      else if (days === 7) rangeText = indexData?.newsSection?.lastWeekText || '最近一周';
      else if (days === 15) rangeText = indexData?.newsSection?.lastHalfMonthText || '最近半月';
      else if (days === 30) rangeText = indexData?.newsSection?.lastMonthText || '最近一个月';
      setSelectedRange(rangeText);
      
      onDateRangeChange(startDateStr, endDateStr);
    }
    setShowDropDown(false);
    // 确保焦点回到日期范围按钮，提供更好的用户体验
    buttonRef.current?.focus();
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
        const customRangeText = `${startDate} ${indexData?.newsSection?.toText || '至'} ${endDate}`;
        onDateRangeChange(startDate, endDate);
      } else {
        alert(indexData?.newsSection?.dateRangeError || '日期范围不能超过90天');
      }
    }
    setShowCalendar(false);
    // 确保焦点回到日期范围按钮，提供更好的用户体验
    buttonRef.current?.focus();
  };

  // 清除日期筛选
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    const lastWeekText = indexData?.newsSection?.lastWeekText || '最近一周';
      setSelectedRange(lastWeekText);
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
      <p className="text-2xl ">{indexData?.newsSection?.dateFilterTitle || '请选择显示新闻的日期：'}</p>
      <div className="relative">
  
        <Button 
          variant="default" 
          className={`rounded-none flex items-center gap-2 transition-all duration-200 ${
            selectedRange !== '最近一周' 
              ? 'bg-primary/90 ring-2 ring-primary/50' 
              : 'bg-primary hover:bg-primary-hover'
          }`}
          onClick={toggleDropDown}
          ref={buttonRef}
        >
          {selectedRange}
          <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: showDropDown ? 'rotate(180deg)' : 'rotate(0)' }} />
        </Button>
        
        {/* 下拉菜单内容 */}
        {showDropDown && (
          <div ref={dropDownRef} className="absolute top-full left-0 mt-1 w-48 bg-background border border-border shadow-lg z-10">
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(null)}
            >
              {indexData?.newsSection?.allText || '全部'}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(3)}
            >
              {indexData?.newsSection?.last3DaysText || '最近三天'}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(7)}
            >
              {indexData?.newsSection?.lastWeekText || '最近一周'}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(15)}
            >
              {indexData?.newsSection?.lastHalfMonthText || '最近半月'}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(30)}
            >
              {indexData?.newsSection?.lastMonthText || '最近一个月'}
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
          {startDate && endDate ? `${startDate} ${indexData?.newsSection?.toText || '至'} ${endDate}` : (indexData?.newsSection?.selectDateRangeText || '选择日期范围')}
        </Button>
        
        {/* 日历选择器 */}
        {showCalendar && (
          <div ref={calendarRef} className="absolute top-full left-0 mt-1 z-10">
            {currentLanguage === 'en' ? (
              <CalendarEN
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleCustomRange}
                dateRangeNote={indexData?.newsSection?.dateRangeNote || 'Note: Maximum date range is 90 days'}
                applyText={indexData?.common?.applyText || 'Apply'}
                toText={indexData?.newsSection?.toText || 'to'}
              />
            ) : (
              <CalendarCN
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleCustomRange}
                dateRangeNote={indexData?.newsSection?.dateRangeNote || '注：最大选择范围为90天'}
                applyText={indexData?.common?.applyText || '应用'}
                toText={indexData?.newsSection?.toText || '至'}
              />
            )}
          </div>
        )}
      </div>
      
      {/* 当前筛选状态显示 */}
      {startDate && endDate && !showCalendar && !showDropDown && (
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">    
          <button 
            className="ml-2 text-white hover:underline border border-primary p-2 bg-primary"
            onClick={handleClear}
          >
            {indexData?.common?.clearText || '清除'}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
