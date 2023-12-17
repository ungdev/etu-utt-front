'use client';
import styles from './DailyTimetable.module.scss';
import { useEffect, useState } from 'react';
import { GetDailyTimetableResponseDto, TimetableEvent } from '@/api/users/getDailyTimetable';
import { API, handleAPIResponse } from '@/api/api';
import { StatusCodes } from 'http-status-codes';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import Icons from '@/icons';
import Button from '@/components/UI/Button';

const DAY_LENGTH = 24 * 3_600_000;

/**
 * Renders a one-day timetable.
 * Users can choose the day they want to see.
 */
export default function DailyTimetable() {
  const [timetable, setTimetable] = useState([] as TimetableEvent[]);
  const [selectedDate, setSelectedDate] = useState(new Date(0));
  const [columnsCount, setColumnsCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    setSelectedDate(new Date(year, month, date));
  }, []);

  /**
   * Called when the selected date is changed.
   * Fetches the timetable of the user for the selected date, and update the state.
   */
  useEffect(() => {
    if (selectedDate.getTime() === 0) return;
    API.get<GetDailyTimetableResponseDto>(
      `/timetable/current/daily/${selectedDate.getDay()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
    ).then((res) =>
      handleAPIResponse(res, {
        [StatusCodes.OK]: (body) => {
          const columnsCount = formatTimetable(body);
          setTimetable(body);
          setColumnsCount(columnsCount);
        },
      }),
    );
  }, [selectedDate]);

  /**
   * Clamps every event of the timetable in the current day, and assign a column number to each event.
   * The operation is done in place.
   * @param timetable The timetable to format.
   * @returns The number of columns that are needed.
   */
  const formatTimetable = (timetable: TimetableEvent[]): number => {
    const endOfSelectedDate = new Date(selectedDate.getTime() + DAY_LENGTH);
    const columnsFreeFrom: Date[] = [];
    for (const event of timetable) {
      if (event.start < selectedDate) {
        event.start = new Date(selectedDate);
      }
      if (event.end > endOfSelectedDate) {
        event.end = new Date(endOfSelectedDate);
      }
      const columnIndex = columnsFreeFrom.findIndex((column) => column < event.start);
      if (columnIndex === -1) {
        columnsFreeFrom.push(event.end);
        event.column = columnsFreeFrom.length - 1;
      } else {
        columnsFreeFrom[columnIndex] = event.end;
        event.column = columnIndex;
      }
    }
    return columnsFreeFrom.length;
  };

  return (
    <div className={styles.dailyTimetable}>
      <h2>EDT JOURNALIER</h2>
      <div className={styles.chooseDay}>
        <Button noStyle onClick={() => setSelectedDate(new Date(selectedDate.getTime() - DAY_LENGTH))}>
          <Icons.LeftArrow />
        </Button>
        {format(selectedDate, 'cccc d MMMM', { locale: locale.fr })}
        <Button noStyle onClick={() => setSelectedDate(new Date(selectedDate.getTime() + DAY_LENGTH))}>
          <Icons.RightArrow />
        </Button>
      </div>
      <div className={styles.timetable}>
        {timetable.map((event) => (
          <div
            key={event.id}
            className={styles.event}
            style={{
              top: `${((event.start.getTime() - selectedDate.getTime()) / DAY_LENGTH) * 100}%`,
              height: `${((event.end.getTime() - event.start.getTime()) / DAY_LENGTH) * 100}%`,
              left: `${(event.column! / columnsCount) * 100}%`,
              width: `${100 / columnsCount}%`,
            }}></div>
        ))}
      </div>
    </div>
  );
}
