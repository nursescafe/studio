import type { RecordEntry, HourlySummary, DailySummary, ChartDataPoint } from '@/types';
import { format, parseISO, startOfDay, endOfDay, eachHourOfInterval, getHours, addHours, isWithinInterval, set } from 'date-fns';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm');
};

export const formatDateTimeForInput = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm");
};


export const calculateDailySummary = (records: RecordEntry[], targetDate: Date): DailySummary => {
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);

  const dailyRecords = records.filter(record =>
    isWithinInterval(new Date(record.timestamp), { start: dayStart, end: dayEnd })
  );

  let totalIntake = 0;
  let totalOutput = 0;

  dailyRecords.forEach(record => {
    if (record.type === 'intake') {
      totalIntake += record.amount;
    } else {
      totalOutput += record.amount;
    }
  });

  const hourlySummaries = calculate3HourSummaries(dailyRecords, targetDate);

  return {
    date: format(targetDate, 'yyyy-MM-dd'),
    totalIntake,
    totalOutput,
    balance: totalIntake - totalOutput,
    hourlySummaries,
  };
};

export const calculate3HourSummaries = (records: RecordEntry[], targetDate: Date): HourlySummary[] => {
  const summaries: HourlySummary[] = [];
  const dayStart = startOfDay(targetDate);

  for (let i = 0; i < 24; i += 3) {
    const slotStart = addHours(dayStart, i);
    const slotEnd = addHours(slotStart, 3); // Non-inclusive end, or use 2 hours 59 mins 59 secs

    const slotRecords = records.filter(record => {
        const recordTime = new Date(record.timestamp);
        // Interval is [slotStart, slotEnd)
        return recordTime >= slotStart && recordTime < slotEnd;
    });
    
    let intake = 0;
    let output = 0;

    slotRecords.forEach(record => {
      if (record.type === 'intake') {
        intake += record.amount;
      } else {
        output += record.amount;
      }
    });

    summaries.push({
      hourSlot: `${format(slotStart, 'HH:mm')} - ${format(addHours(slotEnd, -1/60), 'HH:mm')}`, // e.g. 00:00 - 02:59
      intake,
      output,
    });
  }
  return summaries;
};


export const getChartData = (dailySummary: DailySummary | null): ChartDataPoint[] => {
  if (!dailySummary) return [];
  return dailySummary.hourlySummaries.map(summary => ({
    time: summary.hourSlot.split(' - ')[0], // Use start of the slot
    intake: summary.intake,
    output: summary.output,
  }));
};
