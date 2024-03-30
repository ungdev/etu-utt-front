import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children = false,
  onClick = () => {},
  className = '',
  disabled = false,
  noStyle = false,
  background = 'blue',
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  noStyle?: boolean;
  background?: 'blue' | 'white';
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className} ${noStyle ? styles.noStyle : ''} ${styles[`background-${background}`]}`}
      disabled={disabled}>
      {children}
    </button>
  );
}
