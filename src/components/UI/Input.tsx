import styles from './Input.module.scss';
import { HTMLInputTypeAttribute } from 'react';

export default function Input<T extends string | number>({
  className = '',
  onChange = () => {},
  value,
  placeholder,
  type = 'text',
}: {
  className?: string;
  onChange?: (v: T) => void;
  value?: T;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <input
      className={`${styles.input} ${className}`}
      onChange={(v) => onChange(v.target.value as T)}
      value={value}
      placeholder={placeholder}
      type={type}
    />
  );
}
