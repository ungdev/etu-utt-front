import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children = false,
  onClick = () => {},
  className = '',
  raw = false,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  raw?: boolean;
}) {
  return (
    <button onClick={onClick} className={`${styles.button} ${className} ${raw ? styles.raw : ''}`}>
      {children}
    </button>
  );
}
