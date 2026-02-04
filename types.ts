export interface BodyMetrics {
  weight: number; // kg
  muscleMass: number; // kg (골격근량)
  bodyFatPercent: number; // % (체지방률)
}

export interface WorkoutRecord {
  note: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  metrics?: BodyMetrics;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  dayStatus?: 'workout' | 'rest' | 'travel' | 'sick'; // New field
  exercises?: Record<string, string[]>; // e.g. { '헬스': ['스쿼트', '벤치프레스'], '러닝': ['5km', '인터벌'] }
}

export type CalendarData = Record<string, DailyLog>;
