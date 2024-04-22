import styles from './ResultsList.module.scss';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { useAppTranslation } from '@/lib/i18n';

export function ResultsList<T extends object>({
  data,
  totalResults,
  baseRedirectUrl,
  getItemId = (item: T) =>
    'id' in item
      ? (item.id as string)
      : (() => {
          console.error("Set value of getItemId, the field cannot be defaulted as 'id' is not a property of the item.");
          return '';
        })(),
  InfoFC,
}: {
  data: T[];
  totalResults: number;
  baseRedirectUrl: string;
  getItemId?: (item: T) => string;
  InfoFC: FC<{ item: T }>;
}) {
  const router = useRouter();
  const { t } = useAppTranslation();
  return (
    <div className={styles.resultsList}>
      <div className={styles.totalResults}>
        {totalResults} {t('common:results')}
      </div>
      <div className={styles.results}>
        {data.map((item) => (
          <div
            key={getItemId(item)}
            className={styles.result}
            onClick={() => router.push(`${baseRedirectUrl}/${getItemId(item)}`)}>
            <InfoFC item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
