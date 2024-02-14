import styles from './TextArea.module.scss';

export default function TextArea({
  className = '',
  onChange = () => {},
  value,
  placeholder,
}: {
  className?: string;
  onChange?: (v: string) => void;
  value?: string;
  placeholder?: string;
}) {
  return (
    <textarea
      className={`${styles.input} ${className}`}
      onChange={(v) => onChange(v.target.value)}
      value={value}
      placeholder={placeholder}
    />
  );
}
