import styles from './Button.module.scss';
import { ReactNode } from 'react';

export default function Button({
  children,
  onClick,
  className,
  noStyle = false,
}: {
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
  noStyle?: boolean;
}) {
  return (
    <button onClick={onClick} className={`${styles.button} ${className} ${noStyle ? styles.noStyle : ''}`}>
      {children}
    </button>
  );
}
