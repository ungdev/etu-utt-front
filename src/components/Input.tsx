export interface InputType {
  text: string;
  number: number;
}

export default function Input<T extends keyof InputType>({
  value,
  onChange,
  type,
  className,
}: {
  value: InputType[T];
  onChange: (value: InputType[T]) => void;
  type: T;
  className: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value as InputType[T])}
      className={className}
    />
  );
}
