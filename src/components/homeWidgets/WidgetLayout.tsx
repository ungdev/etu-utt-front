import styles from './WidgetLayout.module.scss';
import { ReactNode } from 'react';

export function WidgetLayout({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={styles.widget}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={className}>{children}</div>
    </div>
  );
}
