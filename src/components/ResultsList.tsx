import styles from './ResultsList.module.scss';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

export function ResultsList<T extends object>({
  data,
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
  baseRedirectUrl: string;
  getItemId?: (item: T) => string;
  InfoFC: FC<{ item: T }>;
}) {
  const router = useRouter();
  return (
    <div className={styles.resultsList}>
      {data.map((item) => (
        <div
          key={getItemId(item)}
          className={styles.result}
          onClick={() => router.push(`${baseRedirectUrl}/${getItemId(item)}`)}>
          <div className={styles.basicInfo}>
            <InfoFC item={item} />
          </div>
          <p className={styles.details}>Détails {'>'}</p>
        </div>
      ))}
    </div>
  );
}
