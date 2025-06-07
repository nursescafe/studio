'use client';

import type { RecordEntry } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';
import { RecordItem } from './RecordItem';

interface RecordListDisplayProps {
  records: RecordEntry[];
  onDeleteRecord: (id: string) => void;
}

export function RecordListDisplay({ records, onDeleteRecord }: RecordListDisplayProps) {
  const sortedRecords = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <ListChecks className="mr-2 h-6 w-6 text-primary" />
          All Records
        </CardTitle>
        <CardDescription>View and manage your recorded entries.</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecords.length > 0 ? (
          <ScrollArea className="h-[300px] pr-3">
            {sortedRecords.map(record => (
              <RecordItem key={record.id} record={record} onDeleteRecord={onDeleteRecord} />
            ))}
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">No records yet. Add one using the form above!</p>
        )}
      </CardContent>
    </Card>
  );
}
