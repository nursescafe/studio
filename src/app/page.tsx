'use client';

import { useState, useEffect, useMemo } from 'react';
import type { RecordEntry, DailySummary, ChartDataPoint } from '@/types';
import { Header } from '@/components/flow-balance/Header';
import { RecordForm } from '@/components/flow-balance/RecordForm';
import { SummaryDisplay } from '@/components/flow-balance/SummaryDisplay';
import { FlowChart } from '@/components/flow-balance/FlowChart';
import { RecordListDisplay } from '@/components/flow-balance/RecordListDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // For date picker
import { Label } from '@/components/ui/label'; // For date picker label
import { Card, CardContent } from '@/components/ui/card';
import { calculateDailySummary, getChartData, formatDateTimeForInput } from '@/lib/flow-utils';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function FlowBalancePage() {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const { toast } = useToast();

  // Load records from localStorage on initial mount
  useEffect(() => {
    const storedRecords = localStorage.getItem('flowBalanceRecords');
    if (storedRecords) {
      try {
        const parsedRecords: RecordEntry[] = JSON.parse(storedRecords).map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp), // Ensure timestamp is a Date object
        }));
        setRecords(parsedRecords);
      } catch (error) {
        console.error("Failed to parse records from localStorage", error);
        localStorage.removeItem('flowBalanceRecords'); // Clear corrupted data
      }
    }
  }, []);

  // Update localStorage whenever records change
  useEffect(() => {
    localStorage.setItem('flowBalanceRecords', JSON.stringify(records));
  }, [records]);

  // Calculate summaries and chart data when records or selectedDate change
  useEffect(() => {
    const summary = calculateDailySummary(records, selectedDate);
    setDailySummary(summary);
    setChartData(getChartData(summary));
  }, [records, selectedDate]);

  const handleAddRecord = (newRecord: RecordEntry) => {
    setRecords(prevRecords => [...prevRecords, newRecord]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prevRecords => prevRecords.filter(record => record.id !== id));
    toast({
      title: "Record Deleted",
      description: "The selected record has been removed.",
      variant: "default",
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = event.target.value;
    if (dateValue) {
      setSelectedDate(parseISO(dateValue));
    }
  };
  
  const formattedSelectedDateForInput = useMemo(() => {
    return format(selectedDate, 'yyyy-MM-dd');
  }, [selectedDate]);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 space-y-6">
            <RecordForm onAddRecord={handleAddRecord} />
            <Card>
              <CardContent className="p-4">
                <Label htmlFor="summary-date" className="block text-sm font-medium mb-1">Select Date for Summary</Label>
                <Input
                  type="date"
                  id="summary-date"
                  value={formattedSelectedDateForInput}
                  onChange={handleDateChange}
                  className="w-full"
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <SummaryDisplay dailySummary={dailySummary} />
            <FlowChart data={chartData} title={`Fluid Balance for ${format(selectedDate, 'MMMM d, yyyy')}`} />
          </div>
        </div>
        
        <RecordListDisplay records={records} onDeleteRecord={handleDeleteRecord} />

      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <p>&copy; {new Date().getFullYear()} FlowBalance. Stay hydrated!</p>
      </footer>
    </div>
  );
}
