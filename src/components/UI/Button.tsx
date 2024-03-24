import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children = false,
  onClick = () => {},
  className = '',
  disabled = false,
  noStyle = false,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  noStyle?: boolean;
}) {
  return (
    <button onClick={onClick} className={`${styles.button} ${className} ${noStyle ? styles.noStyle : ''}`} disabled={disabled}>
      {children}
    </button>
  );
}
