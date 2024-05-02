import styles from './ResultsList.module.scss';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import Loader from '@/icons/Loader';

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
  itemFactory: ItemFactory,
  onEndReached,
  loading,
}: {
  data: T[];
  totalResults: number;
  baseRedirectUrl: string;
  getItemId?: (item: T) => string;
  itemFactory: FC<{ item: T }>;
  onEndReached?: () => void;
  loading?: boolean;
}) {
  const router = useRouter();
  const { t } = useAppTranslation();
  const visibilityTrigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onEndReached) {
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            intersectionObserver.disconnect();
            onEndReached();
          }
        },
        {
          threshold: 0.1,
          root: null,
        },
      );
      if (visibilityTrigger.current) intersectionObserver.observe(visibilityTrigger.current);
      return () => intersectionObserver.disconnect();
    }
  }, [data, onEndReached]);

  return (
    <div className={styles.resultsList}>
      <div className={styles.totalResults}>
        {totalResults} {t('common:results')}
      </div>
      <div className={styles.results}>
        {data.map((item, index) => (
          <div
            key={getItemId(item)}
            ref={index === data.length - 1 ? visibilityTrigger : undefined}
            className={styles.result}
            onClick={() => router.push(`${baseRedirectUrl}/${getItemId(item)}`)}>
            <ItemFactory item={item} />
          </div>
        ))}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Loader />
          {t('common:loading')}
        </div>
      )}
    </div>
  );
}
