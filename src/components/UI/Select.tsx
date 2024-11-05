import styles from './Select.module.scss';

export default function Select<Choices extends string = string>({
  options,
  value,
  onSelect,
  className = '',
}: {
  options: Array<{ id: Choices; name: string }>;
  value: string;
  onSelect: (item: Choices) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onSelect(event.currentTarget.value as Choices)}
      className={`${styles.select} ${className}`}>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
