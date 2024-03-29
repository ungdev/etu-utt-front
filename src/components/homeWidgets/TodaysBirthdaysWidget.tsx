import styles from './TodaysBirthdaysWidget.module.scss';
import { useAppTranslation } from '@/lib/i18n';
import { WidgetLayout } from '@/components/homeWidgets/WidgetLayout';
import useTodaysBirthdays from '@/api/users/getTodaysBirthdays';

export default function UEBrowserWidget() {
  const { t } = useAppTranslation();
  const users = useTodaysBirthdays();
  return (
    <WidgetLayout
      title={t('parking:todaysBirthdays.title')}
      subtitle={t('parking:todaysBirthdays.subtitle')}
      className={styles.widget}>
      {users !== null
        ? users.length === 0
          ? "Aucun anniversaire aujourd'hui"
          : users.map((user) => (
              <div key={user.id} className={styles.user}>
                <div className={styles.name}>
                  {user.firstName} {user.lastName}
                </div>
                <div className={styles.age}>{t('parking:todaysBirthday:age', { age: user.age })}</div>
              </div>
            ))
        : t('parking:todaysBirthday:beConnected')}
    </WidgetLayout>
  );
}
