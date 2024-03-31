import styles from './TimetableDay.module.scss';
import { TimetableEvent } from '@/api/users/getDailyTimetable';
import { useEffect, useState } from 'react';
import { DAY_LENGTH } from '@/utils/utils';

export function TimetableDay({
  events,
  day,
  className = '',
}: {
  events: TimetableEvent[];
  day: Date;
  className?: string;
}) {
  const [columnsCount, setColumnsCount] = useState(0);

  useEffect(() => {
    setColumnsCount(formatTimetable(events));
  }, []);

  /**
   * Clamps every event of the timetable in the current day, and assign a column number to each event.
   * The operation is done in place.
   * @param timetable The timetable to format.
   * @returns The number of columns that are needed.
   */
  const formatTimetable = (timetable: TimetableEvent[]): number => {
    const endOfSelectedDate = new Date(day.getTime() + DAY_LENGTH);
    // For each column, the array contains the next time the column will be free and able to receive an event.
    const columnsFreeFrom: Date[] = [];
    for (const event of timetable) {
      if (event.start < day) {
        event.start = new Date(day);
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
    <div className={`${styles.timetableDay} ${className}`}>
      <div className={styles.hours}>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <span>{i * 2}h</span>
            </div>
          ))}
      </div>
      <div className={styles.events}>
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={styles.timeSeparator} />
          ))}
        {events.map((event) => (
          <div
            key={event.id}
            className={styles.event}
            style={{
              top: `${((event.start.getTime() - day.getTime()) / DAY_LENGTH) * 100}%`,
              height: `${((event.end.getTime() - event.start.getTime()) / DAY_LENGTH) * 100}%`,
              left: `${(event.column! / columnsCount) * 100}%`,
              width: `${100 / columnsCount}%`,
            }}></div>
        ))}
      </div>
    </div>
  );
}
