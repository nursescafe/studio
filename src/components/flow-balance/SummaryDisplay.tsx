'use client';

import type { DailySummary, HourlySummary } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BarChart3, CalendarDays, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SummaryDisplayProps {
  dailySummary: DailySummary | null;
}

export function SummaryDisplay({ dailySummary }: SummaryDisplayProps) {
  if (!dailySummary) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Fluid Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available for the selected day.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <CalendarDays className="mr-2 h-6 w-6 text-primary" />
          Daily Summary: {dailySummary.date}
        </CardTitle>
        <CardDescription>Overview of your fluid balance for the day.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Card className="p-4 bg-secondary/50">
            <CardTitle className="text-lg font-medium flex items-center justify-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" /> Total Intake
            </CardTitle>
            <p className="text-2xl font-semibold text-primary">{dailySummary.totalIntake} mL</p>
          </Card>
          <Card className="p-4 bg-secondary/50">
            <CardTitle className="text-lg font-medium flex items-center justify-center">
              <TrendingDown className="mr-2 h-5 w-5 text-orange-500" /> Total Output
            </CardTitle>
            <p className="text-2xl font-semibold text-primary">{dailySummary.totalOutput} mL</p>
          </Card>
          <Card className="p-4 bg-secondary/50">
            <CardTitle className="text-lg font-medium flex items-center justify-center">
              <Minus className="mr-2 h-5 w-5 text-blue-500" /> Net Balance
            </CardTitle>
            <p className={`text-2xl font-semibold ${dailySummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {dailySummary.balance} mL
            </p>
          </Card>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center font-headline">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            3-Hourly Breakdown
          </h3>
          {dailySummary.hourlySummaries.length > 0 ? (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-3">
                {dailySummary.hourlySummaries.map((summary, index) => (
                  <Card key={index} className="p-3 bg-background border">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-sm">{summary.hourSlot}</p>
                      <div className="text-xs space-x-3">
                        <span className="text-green-600">In: {summary.intake} mL</span>
                        <span className="text-orange-600">Out: {summary.output} mL</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No 3-hourly data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
