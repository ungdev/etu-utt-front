import styles from './ResultsList.module.scss';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef } from 'react';
import { useAppTranslation } from '@/lib/i18n';
import Icons from '@/icons';

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
  data: (T | null)[];
  totalResults: number;
  baseRedirectUrl: string;
  getItemId?: (item: T) => string;
  /**
   * A {@link React.FunctionComponent FC} that turns data passed into FC's `item` property.
   * This data may be `null` if the data source has not been loaded yet (in such cases, consider data is loading)
   */
  itemFactory: FC<{ item: T | null }>;
  onEndReached?: () => void;
  loading?: boolean;
}) {
  const router = useRouter();
  const { t } = useAppTranslation();
  const visibilityTrigger = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onEndReached && data[data.length - 1] && totalResults > data.length) {
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
  }, [data]);

  return (
    <div className={styles.resultsList}>
      <div className={styles.totalResults}>
        {totalResults} {t('common:results')}
      </div>
      <div className={styles.results}>
        {data.map((item, index) => (
          <div
            key={index}
            ref={index === data.length - 1 ? visibilityTrigger : undefined}
            className={styles.result}
            onClick={() => item && router.push(`${baseRedirectUrl}/${getItemId(item)}`)}>
            <ItemFactory item={item} />
          </div>
        ))}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Icons.Loader />
          {t('common:loading')}
        </div>
      )}
    </div>
  );
}
