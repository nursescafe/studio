'use client';

import type { ChartDataPoint } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface FlowChartProps {
  data: ChartDataPoint[];
  title?: string;
}

export function FlowChart({ data, title = "Fluid Balance Overview" }: FlowChartProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Activity className="mr-2 h-6 w-6 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>Visual representation of your intake and output over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} label={{ value: 'Amount (mL)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="intake" fill="hsl(var(--chart-1))" name="Intake" radius={[4, 4, 0, 0]} />
            <Bar dataKey="output" fill="hsl(var(--chart-2))" name="Output" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data to display in chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
