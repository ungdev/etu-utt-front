'use client';
import styles from './styles.module.scss';
import { useEffect, useState } from 'react';
import { useAPI } from '@/api/api';
import { DAY_LENGTH, roundToStartOfDay } from '@/utils/utils';
import { TimetableDay } from '@/components/timetable/TimetableDay';
import { format } from 'date-fns';
import * as locale from 'date-fns/locale';
import Button from '@/components/UI/Button';
import { useTimetableEvents } from '@/api/timetable/getTimetableEvents';
import { createTimetableEvent } from '@/api/timetable/createTimetableEvent';

export default function TimetablePage() {
  const [firstDay, setFirstDay] = useState(roundToStartOfDay(new Date()));
  const [numberOfDays, setNumberOfDays] = useState(7);
  const events = useTimetableEvents(firstDay, numberOfDays);
  const [eventIndicesPerDay, setEventIndicesPerDay] = useState([] as number[][]);
  const api = useAPI();
  useEffect(() => {
    const offset = numberOfDays === 7 ? -(firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1) : 0;
    setFirstDay(new Date(firstDay.getTime() + offset * DAY_LENGTH)); // I verified, there is no problem with changing the clocks :)
  }, [numberOfDays]);
  useEffect(() => {
    const newEventsPerDay = new Array(numberOfDays).fill(undefined).map(() => []) as number[][];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const startDayIndex = Math.floor((roundToStartOfDay(event.start).getTime() - firstDay.getTime()) / DAY_LENGTH);
      const endDayIndex = Math.floor((roundToStartOfDay(event.end).getTime() - firstDay.getTime()) / DAY_LENGTH);
      for (let j = startDayIndex; j < endDayIndex; j++) {
        newEventsPerDay[j].push(i);
      }
    }
    setEventIndicesPerDay(newEventsPerDay);
  }, [events, firstDay, numberOfDays]);

  return (
    <div className={styles.timetablePage}>
      <h1>Timetable</h1>
      <div className={styles.settings}>
        <div className={styles.range}>
          <Button noStyle onClick={() => setFirstDay(new Date(firstDay.getTime() - DAY_LENGTH * numberOfDays))}>
            {'<'}
          </Button>
          <p>
            {format(firstDay, `d MMMM yyyy`, {
              locale: locale.fr,
            })}{' '}
            au{' '}
            {format(new Date(firstDay.getTime() + (numberOfDays - 1) * DAY_LENGTH), `d MMMM yyyy`, {
              locale: locale.fr,
            })}
          </p>
          <Button noStyle onClick={() => setFirstDay(new Date(firstDay.getTime() + DAY_LENGTH * numberOfDays))}>
            {'>'}
          </Button>
        </div>
        <div className={styles.rangeLength}>
          <Button noStyle onClick={() => setNumberOfDays(1)}>
            1 jour
          </Button>
          <Button noStyle onClick={() => setNumberOfDays(3)}>
            3 jours
          </Button>
          <Button noStyle onClick={() => setNumberOfDays(7)}>
            7 jours
          </Button>
        </div>
      </div>
      <div className={styles.timetable}>
        {eventIndicesPerDay.map((eventIndices, i) => (
          <div key={i} className={styles.day}>
            <h2 className={styles.dayTitle}>
              {format(new Date(firstDay.getTime() + i * DAY_LENGTH), `ccc d`, {
                locale: locale.fr,
              })}
            </h2>
            <TimetableDay
              events={eventIndices.map((i) => events[i])}
              day={new Date(firstDay.getTime() + i * DAY_LENGTH)}
              className={styles.dayTimetable}
              onClickOnEmptySlot={(time) =>
                createTimetableEvent(api, time, new Date(time.getTime() + 3_600_000), 'a random place')
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
