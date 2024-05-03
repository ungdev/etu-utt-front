import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children = false,
  onClick = () => {},
  className = '',
  disabled = false,
  noStyle = false,
  background = 'blue',
  noTab = false,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  noStyle?: boolean;
  background?: 'blue' | 'white';
  noTab?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className} ${noStyle ? styles.noStyle : ''} ${styles[`background-${background}`]}`}
      disabled={disabled}
      tabIndex={noTab ? -1 : undefined}>
      {children}
    </button>
  );
}
