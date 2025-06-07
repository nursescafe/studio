'use client';

import type { RecordEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, GlassWater, Pipette } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/flow-utils';

interface RecordItemProps {
  record: RecordEntry;
  onDeleteRecord: (id: string) => void;
}

export function RecordItem({ record, onDeleteRecord }: RecordItemProps) {
  const isIntake = record.type === 'intake';

  return (
    <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          {isIntake ? (
            <GlassWater className="h-6 w-6 mr-3 text-blue-500" />
          ) : (
            <Pipette className="h-6 w-6 mr-3 text-orange-500 transform rotate-180" />
          )}
          <div>
            <p className={`font-semibold ${isIntake ? 'text-blue-600' : 'text-orange-700'}`}>
              {record.amount} mL
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteRecord(record.id)}
          aria-label="Delete record"
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
