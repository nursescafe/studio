export interface RecordEntry {
  id: string;
  type: 'intake' | 'output';
  amount: number; // in milliliters (mL)
  timestamp: Date;
  notes?: string;
}

export interface HourlySummary {
  hourSlot: string; // e.g., "00:00 - 02:59"
  intake: number;
  output: number;
}

export interface DailySummary {
  date: string; // e.g., "YYYY-MM-DD"
  totalIntake: number;
  totalOutput: number;
  balance: number;
  hourlySummaries: HourlySummary[];
}

export interface ChartDataPoint {
  time: string;
  intake?: number;
  output?: number;
}
