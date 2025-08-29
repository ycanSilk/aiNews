import React from 'react';

interface CalendarProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  dateRangeNote: string;
  applyText: string;
  toText: string;
}

const CalendarCN: React.FC<CalendarProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  dateRangeNote,
  applyText,
  toText
}) => {
  return (
    <div className="p-4 bg-background border border-border shadow-lg">
      {/* 显示当前选中的日期范围 */}
      {(startDate || endDate) && (
        <div className="mb-3 p-2 bg-muted rounded-sm text-sm">
          <span className="font-medium">已选择: </span>
          {startDate && endDate ? `${startDate} ${toText} ${endDate}` : '请选择开始和结束日期'}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-border rounded-none p-2 text-sm w-full md:w-40"
          placeholder="开始日期"
          lang="zh-CN"
        />
        <span className="text-sm whitespace-nowrap">{toText}</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-border rounded-none p-2 text-sm w-full md:w-40"
          placeholder="结束日期"
          lang="zh-CN"
        />
        <button
          onClick={onApply}
          className="bg-primary hover:bg-primary-hover text-white px-3 py-2 text-sm rounded-none h-9 w-full md:w-auto"
        >
          {applyText}
        </button>
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {dateRangeNote}
      </div>
    </div>
  );
};

export default CalendarCN;