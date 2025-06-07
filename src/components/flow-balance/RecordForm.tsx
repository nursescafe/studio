'use client';

import type { RecordEntry } from '@/types';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassWater, Pipette, PlusCircle, Clock } from 'lucide-react';
import { formatDateTimeForInput, generateId } from '@/lib/flow-utils';
import { useToast } from '@/hooks/use-toast';

interface RecordFormProps {
  onAddRecord: (record: RecordEntry) => void;
}

export function RecordForm({ onAddRecord }: RecordFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>(formatDateTimeForInput(new Date()));
  const [type, setType] = useState<'intake' | 'output'>('intake');
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive number for the amount.",
        variant: "destructive",
      });
      return;
    }
    if (!timestamp) {
      toast({
        title: "Invalid Time",
        description: "Please select a valid date and time.",
        variant: "destructive",
      });
      return;
    }

    const newRecord: RecordEntry = {
      id: generateId(),
      amount: numericAmount,
      timestamp: new Date(timestamp),
      type,
    };
    onAddRecord(newRecord);
    setAmount('');
    // setTimestamp(formatDateTimeForInput(new Date())); // Optionally reset time or keep it
    toast({
      title: "Record Added",
      description: `${type === 'intake' ? 'Intake' : 'Output'} of ${numericAmount}mL recorded.`,
      variant: "default",
      className: "bg-accent text-accent-foreground"
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Add New Record
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type</Label>
            <RadioGroup
              defaultValue="intake"
              onValueChange={(value: 'intake' | 'output') => setType(value)}
              className="flex space-x-4 pt-1"
              id="type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intake" id="intake" />
                <Label htmlFor="intake" className="flex items-center cursor-pointer">
                  <GlassWater className="mr-2 h-5 w-5 text-primary" /> Intake
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="output" id="output" />
                <Label htmlFor="output" className="flex items-center cursor-pointer">
                  <Pipette className="mr-2 h-5 w-5 text-primary transform rotate-180" /> Output
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium flex items-center">
              <Pipette className="mr-2 h-5 w-5 text-primary" /> Amount (mL)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 250"
              required
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timestamp" className="text-sm font-medium flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" /> Date and Time
            </Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add Record
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
