import styles from './Select.module.scss';
import { useMemo, useState } from "react";

// Typing there seems stupid, but it seems you have to set the options type more explicitly
export default function Select<T extends string>({ options, value, onChange, className }: {options: Record<T, string>, value: T, onChange: (value: T) => void, className: string}) {
  return (
    <select
      className={`${styles.select} ${className}`}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      defaultValue={value}>
      {Object.entries(options).map(([key, text]) => (
        <option key={key} value={key} className={styles.option}>
          {text}
        </option>
      ))}
    </select>
  )
}