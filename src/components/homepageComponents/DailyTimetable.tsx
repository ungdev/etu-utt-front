'use client';
import styles from './DailyTimetable.module.scss';
import { useEffect, useState } from 'react';
import { GetDailyTimetableResponseDto, TimetableEvent } from '@/api/users/getDailyTimetable';
import { useAPI } from '@/api/api';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import Icons from '@/icons';
import Button from '@/components/UI/Button';
import { TimetableDay } from '@/components/timetable/TimetableDay';

const DAY_LENGTH = 24 * 3_600_000;

/**
 * Renders a one-day timetable.
 * Users can choose the day they want to see.
 */
export default function DailyTimetable() {
  const [timetable, setTimetable] = useState([] as TimetableEvent[]);
  const [selectedDate, setSelectedDate] = useState(new Date(0));
  const api = useAPI();

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
      .on('success', setTimetable);
  }, [selectedDate]);

  return (
    <div className={styles.dailyTimetable}>
      <h2>EDT JOURNALIER</h2>
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
      <TimetableDay className={styles.timetable} day={selectedDate} events={timetable} />
    </div>
  );
}
