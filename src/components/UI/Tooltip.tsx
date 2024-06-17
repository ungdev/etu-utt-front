import styles from './Tooltip.module.scss';
import { ReactNode } from 'react';

export default function Tooltip({
  children = false,
  className = '',
  content = '',
}: {
  className?: string | string[];
  content: string;
  children: ReactNode;
}) {
  return (
    <div className={[styles.tooltipContainer, className].flat().join(' ')}>
      {children}
      <div className={styles.tooltip}>{content}</div>
    </div>
  );
}
