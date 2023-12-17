export interface TimetableEvent {
  id: string;
  start: Date;
  end: Date;
  location: string;
  column?: number;
}

export type GetDailyTimetableResponseDto = Array<Omit<TimetableEvent, 'column'>>;
