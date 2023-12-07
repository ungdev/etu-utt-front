import styles from './Input.module.scss';

export default function Input<T extends string | number>({
  className = '',
  onChange = () => {},
  value,
  placeholder,
}: {
  className?: string;
  onChange?: (v: T) => void;
  value?: T;
  placeholder?: string;
}) {
  return (
    <input
      className={`${styles.input} ${className}`}
      onChange={(v) => onChange(v.target.value as T)}
      value={value}
      placeholder={placeholder}
    />
  );
}
