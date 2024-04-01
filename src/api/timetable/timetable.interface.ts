export interface TimetableCreateEntryRequestDto {
  location: string;
  duration: number;
  firstRepetitionDate: Date;
  repetitionFrequency?: number;
  repetitions?: number;
  groups: string[];
}
