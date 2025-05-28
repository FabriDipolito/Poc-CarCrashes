'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DatePickerProps = {
  label: string;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  minYear: number;
  maxYear: number;
  startDate?: Date;
  endDate?: Date;
};


export function DatePicker({ label, date, setDate, minYear, maxYear, startDate, endDate }: DatePickerProps) {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] justify-start text-left font-normal cursor-pointer',
              !date && 'text-muted-foreground'
            )}
          >
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={setDate}
            disabled={(currentDate) => {
              const tooLate = currentDate > new Date(`${maxYear + 1}-01-01`);
              const tooEarly = currentDate < new Date(`${minYear}-01-01`);

              const beforeStart = label === 'End Date' && startDate
                ? currentDate < startDate
                : false;

              const afterEnd = label === 'Start Date' && endDate
                ? currentDate > endDate
                : false;

              return tooLate || tooEarly || beforeStart || afterEnd;
            }}
            fromYear={minYear}
            toYear={maxYear}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
