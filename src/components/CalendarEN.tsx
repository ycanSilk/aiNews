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

const CalendarEN: React.FC<CalendarProps> = ({
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
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border border-border rounded-none p-2 text-sm w-full md:w-40"
          placeholder="Start date"
          lang="en-US"
        />
        <span className="text-sm whitespace-nowrap">{toText}</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border border-border rounded-none p-2 text-sm w-full md:w-40"
          placeholder="End date"
          lang="en-US"
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

export default CalendarEN;