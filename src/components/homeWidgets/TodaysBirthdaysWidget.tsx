import styles from './TodaysBirthdaysWidget.module.scss';
import { useAppTranslation } from '@/lib/i18n';
import { WidgetLayout } from '@/components/homeWidgets/WidgetLayout';
import useTodaysBirthdays from '@/api/users/getTodaysBirthdays';

export default function TodaysBirthdaysWidget() {
  const { t } = useAppTranslation();
  const users = useTodaysBirthdays();
  return (
    <WidgetLayout
      title={t('homepage:todaysBirthdays.title')}
      subtitle={t('homepage:todaysBirthdays.subtitle')}
      className={styles.widget}>
      {users !== null
        ? users.length === 0
          ? t('homepage:todaysBirthdays.noBirthdays')
          : users.map((user) => (
              <div key={user.id} className={styles.user}>
                <div className={styles.name}>
                  {user.firstName} {user.lastName}
                </div>
                <div className={styles.age}>{t('homepage:todaysBirthdays.age', { age: user.age })}</div>
              </div>
            ))
        : t('homepage:todaysBirthdays.beConnected')}
    </WidgetLayout>
  );
}
