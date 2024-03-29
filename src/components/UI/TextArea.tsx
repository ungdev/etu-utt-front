import styles from './TextArea.module.scss';

export default function TextArea({
  className = '',
  onChange = () => {},
  value,
  placeholder,
  onFocusLost = () => {},
  autoFocus = false,
}: {
  className?: string;
  onChange?: (v: string) => void;
  value?: string;
  placeholder?: string;
  onFocusLost?: () => void;
  autoFocus?: boolean;
}) {
  return (
    <textarea
      className={`${styles.input} ${className}`}
      onChange={(v) => onChange(v.target.value)}
      value={value}
      placeholder={placeholder}
      onBlur={() => onFocusLost()}
      autoFocus={autoFocus}
      onKeyDownCapture={(e) => e.key === 'Escape' && (document.activeElement as HTMLElement).blur()}
    />
  );
}
