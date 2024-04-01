import styles from './Input.module.scss';
import { FC, HTMLInputTypeAttribute } from 'react';
import Button from '@/components/UI/Button';

export default function Input<T extends string | number>({
  className = '',
  onChange = () => {},
  onEnter = () => {},
  value,
  placeholder,
  type = 'text',
  Icon,
}: {
  className?: string;
  onChange?: (v: T) => void;
  onEnter?: () => void;
  value?: T;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  Icon?: FC;
}) {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      <input
        onChange={(v) => onChange(v.target.value as T)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter();
        }}
        value={value}
        placeholder={placeholder}
        type={type}
      />
      <Button noStyle onClick={() => onEnter()}>
        {Icon && <Icon />}
      </Button>
    </div>
  );
}
