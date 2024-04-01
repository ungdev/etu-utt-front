import { useAPI } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { useEffect, useState } from 'react';
import { TimetableEvent } from '@/api/users/getDailyTimetable';

export function useTimetableEvents(firstDay: Date, numberOfDays: number): TimetableEvent[] {
  const api = useAPI();
  const [events, setEvents] = useState<TimetableEvent[]>([]);
  useEffect(() => {
    api
      .get<
        TimetableEvent[]
      >(`/timetable/current/${numberOfDays}/${firstDay.getDate()}/${firstDay.getMonth() + 1}/${firstDay.getFullYear()}/`)
      .on(StatusCodes.OK, setEvents);
  }, [firstDay, numberOfDays]);
  return events;
}
