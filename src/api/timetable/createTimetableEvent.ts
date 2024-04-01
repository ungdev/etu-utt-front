import { API } from '@/api/api';
import { TimetableEvent } from '@/api/users/getDailyTimetable';
import { TimetableCreateEntryRequestDto } from '@/api/timetable/timetable.interface';

export function createTimetableEvent(api: API, start: Date, end: Date, location: string, groups: string[]) {
  return api
    .post<TimetableCreateEntryRequestDto, Omit<TimetableEvent, 'column' | 'id'>>('/timetable/current', {
      firstRepetitionDate: start,
      repetitions: 1,
      duration: end.getTime() - start.getTime(),
      groups: [],
      location,
    })
    .toPromise();
}
