import styles from './Input.module.scss';
import { forwardRef, HTMLInputTypeAttribute, Ref } from 'react';

function Input<T extends string | number = string | number>(
  {
    className = '',
    onChange = () => {},
    onEnter = () => {},
    value,
    placeholder,
    type = 'text',
    autoFocus = false,
    onArrowPressed = () => {},
  }: {
    className?: string;
    onChange?: (v: T) => void;
    onEnter?: () => void;
    value?: T;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    autoFocus?: boolean;
    onArrowPressed?: (direction: 'up' | 'down') => void;
  },
  ref?: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      className={`${styles.input} ${className}`}
      onChange={(v) => onChange(v.target.value as T)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onEnter();
        else if (e.key === 'ArrowUp') onArrowPressed('up');
        else if (e.key === 'ArrowDown') onArrowPressed('down');
      }}
      value={value}
      placeholder={placeholder}
      type={type}
      autoFocus={autoFocus}
    />
  );
}

export default forwardRef(Input);
