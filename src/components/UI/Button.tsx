import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children = false,
  onClick = () => {},
  className = '',
  disabled = false,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button onClick={onClick} className={`${styles.button} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
}
