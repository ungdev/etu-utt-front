'use client';
import styles from './DailyTimetableWidget.module.scss';
import { useEffect, useState } from 'react';
import { GetDailyTimetableResponseDto, TimetableEvent } from '@/api/users/getDailyTimetable';
import { useAPI } from '@/api/api';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import Icons from '@/icons';
import Button from '@/components/UI/Button';
import { WidgetLayout } from '@/components/homeWidgets/WidgetLayout';
import { useAppTranslation } from '@/lib/i18n';

const DAY_LENGTH = 24 * 3_600_000;

/**
 * Renders a one-day timetable.
 * Users can choose the day they want to see.
 */
export default function DailyTimetableWidget() {
  const [timetable, setTimetable] = useState([] as TimetableEvent[]);
  const [selectedDate, setSelectedDate] = useState(new Date(0));
  const [columnsCount, setColumnsCount] = useState(0);
  const api = useAPI();
  const { t } = useAppTranslation();

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
    api
      .get<GetDailyTimetableResponseDto>(
        `/timetable/current/daily/${selectedDate.getDate()}/${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`,
      )
      .on('success', (body) => {
        const columnsCount = formatTimetable(body);
        setTimetable(body);
        setColumnsCount(columnsCount);
      });
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
    <WidgetLayout
      className={styles.dailyTimetable}
      title={t('parking:dailyTimetable.title')}
      subtitle={t('parking:dailyTimetable.subtitle')}>
      <div className={styles.chooseDay}>
        <Button noStyle onClick={() => setSelectedDate(new Date(selectedDate.getTime() - DAY_LENGTH))}>
          <Icons.LeftArrow />
        </Button>
        {format(selectedDate, `cccc d MMMM${selectedDate.getFullYear() === new Date().getFullYear() ? '' : ' yyyy'}`, {
          locale: locale.fr,
        })}
        <Button noStyle onClick={() => setSelectedDate(new Date(selectedDate.getTime() + DAY_LENGTH))}>
          <Icons.RightArrow />
        </Button>
      </div>
      <div className={styles.timetable}>
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
    </WidgetLayout>
  );
}
