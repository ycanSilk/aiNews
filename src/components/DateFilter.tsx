import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

// Static configuration data
const staticIndexData = {
  newsSection: {
    dateFilterTitle: 'Please select the date to display news:',
    lastWeekText: 'Last Week',
    allText: 'All',
    last3DaysText: 'Last 3 Days',
    lastHalfMonthText: 'Last Half Month',
    lastMonthText: 'Last Month',
    toText: 'to',
    dateRangeError: 'Date range cannot exceed 90 days',
    customText: 'Custom'
  }
};

interface DateFilterProps {
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
  onRangeTextChange?: (rangeText: string) => void;
}

const DateFilter = ({ onDateRangeChange, onRangeTextChange }: DateFilterProps) => {
  // Use static configuration
  const currentLanguage = 'en';
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<string>('');

  // Set default selected range
  useEffect(() => {
    setSelectedRange(staticIndexData.newsSection.lastWeekText);
  }, []);

  
  // Create refs for detecting outside clicks
  const dropDownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);

  // Handle preset date range selection
  const handlePresetRange = (days: number | null) => {
    if (days === null) {
      // All - set range from 2000 to today
      const today = new Date();
      const year2000 = new Date(2000, 0, 1); // January 1, 2000
      
      const startDateStr = year2000.toISOString().split('T')[0];
      const endDateStr = today.toISOString().split('T')[0];
      
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      setSelectedRange(staticIndexData.newsSection.allText);
 
      onDateRangeChange(startDateStr, endDateStr);
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days + 1); // +1 to ensure inclusion of start date
      
      const startDateStr = start.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];
      
      setStartDate(startDateStr);
      setEndDate(endDateStr);
      
      // Set selected range text
      let rangeText = '';
      if (days === 3) rangeText = staticIndexData.newsSection.last3DaysText;
      else if (days === 7) rangeText = staticIndexData.newsSection.lastWeekText;
      else if (days === 15) rangeText = staticIndexData.newsSection.lastHalfMonthText;
      else if (days === 30) rangeText = staticIndexData.newsSection.lastMonthText;
      setSelectedRange(rangeText);
      
      onDateRangeChange(startDateStr, endDateStr);
    }
    setShowDropDown(false);
    // Ensure focus returns to date range button for better UX
    buttonRef.current?.focus();
  };

  // Handle custom date range selection
  const handleCustomRange = () => {
    if (startDate && endDate) {
      // Check if date range is within 90 days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 90) {
        const customRangeText = `${startDate} ${staticIndexData.newsSection.toText} ${endDate}`;
        onDateRangeChange(startDate, endDate);
      } else {
        alert(staticIndexData.newsSection.dateRangeError);
      }
    }
    setShowCalendar(false);
    // Ensure focus returns to date range button for better UX
    buttonRef.current?.focus();
  };

  // Clear date filter
  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedRange(staticIndexData.newsSection.lastWeekText);
    onDateRangeChange(null, null);
    setShowCalendar(false);
  };



  // Toggle dropdown display
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
    setShowCalendar(false);
  };

  // Toggle calendar display
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    setShowDropDown(false);
  };

  // Listen for click events to close menu and calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If clicking dropdown button or calendar button, don't close
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      if (calendarButtonRef.current && calendarButtonRef.current.contains(event.target as Node)) {
        return;
      }
      
      // If clicking dropdown content, don't close
      if (dropDownRef.current && dropDownRef.current.contains(event.target as Node)) {
        return;
      }
      
      // If clicking calendar content, don't close
      if (calendarRef.current && calendarRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Click outside, close dropdown and calendar
      setShowDropDown(false);
      setShowCalendar(false);
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
      {/* Dropdown button */}
      <p className="text-2xl ">{staticIndexData.newsSection.dateFilterTitle}</p>
      <div className="relative">
  
        <Button 
          variant="default" 
          className={`rounded-none flex items-center gap-2 transition-all duration-200 ${
            selectedRange !== staticIndexData.newsSection.lastWeekText 
              ? 'bg-primary/90 ring-2 ring-primary/50' 
              : 'bg-primary hover:bg-primary-hover'
          }`}
          onClick={toggleDropDown}
          ref={buttonRef}
        >
          {selectedRange}
          <ChevronDown className="w-4 h-4 transition-transform duration-200" style={{ transform: showDropDown ? 'rotate(180deg)' : 'rotate(0)' }} />
        </Button>
        
        {/* Dropdown content */}
        {showDropDown && (
          <div ref={dropDownRef} className="absolute top-full left-0 mt-1 w-48 bg-background border border-border shadow-lg z-10">
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(null)}
            >
              {staticIndexData.newsSection.allText}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(3)}
            >
              {staticIndexData.newsSection.last3DaysText}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(7)}
            >
              {staticIndexData.newsSection.lastWeekText}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(15)}
            >
              {staticIndexData.newsSection.lastHalfMonthText}
            </button>
            <button 
              className="block w-full text-left px-4 py-2 hover:bg-muted transition-colors"
              onClick={() => handlePresetRange(30)}
            >
              {staticIndexData.newsSection.lastMonthText}
            </button>
          </div>
        )}
      </div>
      
      {/* Calendar selection button */}
      <div className="relative">
        <Button 
          variant="default" 
          className="rounded-none bg-primary hover:bg-primary-hover flex items-center gap-2"
          onClick={toggleCalendar}
          ref={calendarButtonRef}
        >
          <CalendarIcon className="w-4 h-4" />
          {startDate && endDate ? `${startDate} ${staticIndexData.newsSection.toText} ${endDate}` : 'Select news display date'}
        </Button>
        
        {/* Calendar picker */}
        {showCalendar && (
          <div ref={calendarRef} className="absolute top-full left-0 mt-1 z-10 p-4 bg-background border border-border">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-border rounded-md mb-3"
            />
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-border rounded-md mb-3"
            />
            <div className="flex gap-2">
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => {
                  if (startDate && endDate) {
                    onDateRangeChange(startDate, endDate);
                  }
                  setShowCalendar(false);
                }}
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCalendar(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Current filter status display */}
      {startDate && endDate && !showCalendar && !showDropDown && (
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">    
          <button 
            className="ml-2 text-white hover:underline border border-primary p-2 bg-primary"
            onClick={handleClear}
          >
            clear
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
