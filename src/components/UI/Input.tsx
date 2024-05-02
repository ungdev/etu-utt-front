import styles from './Input.module.scss';
import { FC, HTMLInputTypeAttribute, Ref, forwardRef } from 'react';
import Button from '@/components/UI/Button';

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
    icon: Icon,
  }: {
    className?: string;
    onChange?: (v: T) => void;
    onEnter?: () => void;
    value?: T;
    placeholder?: string;
    type?: HTMLInputTypeAttribute;
    autoFocus?: boolean;
    onArrowPressed?: (direction: 'up' | 'down') => void;
    icon?: FC;
  },
  ref?: Ref<HTMLInputElement>,
) {
  return (
    <div className={`${styles.inputWrapper} ${className}`}>
      <input
        ref={ref}
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
      {Icon && (
        <Button noStyle onClick={() => onEnter()} noTab>
          <Icon />
        </Button>
      )}
    </div>
  );
}

export default forwardRef(Input);
