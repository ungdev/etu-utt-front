import styles from './StarRating.module.scss';
import { CSSProperties } from 'react';
import Star from '@/icons/Star';

export default function StarRating({
  stars,
  value,
  onClick,
}: {
  stars: number;
  value: number;
  onClick?: (score: number) => void;
}) {
  return (
    <div className={styles.icons}>
      {new Array(stars).fill(0).map((_, i) => (
        <div
          style={{ '--filled': value < i ? 0 : value > i + 1 ? 1 : value - i } as CSSProperties}
          key={i}
          onClick={onClick && (() => onClick(i + 1))}
          className={`${styles.starWrapper} ${onClick ? styles.hoverEffect : ''}`}>
          <Star />
        </div>
      ))}
    </div>
  );
}
