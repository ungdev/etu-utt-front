import styles from './EditableText.module.scss';
import { JSXElementConstructor, useEffect, useState } from 'react';
import TextArea from '@/components/UI/TextArea';
import FocusableDiv from '@/components/FocusableDiv';

export default function EditableText({
  text,
  EditingFooter,
  className = '',
  textClassName = '',
  enabled = true,
  NormalViewFooter = () => false,
}: {
  text: string;
  EditingFooter: JSXElementConstructor<{ text: string; disable: () => void }>;
  className?: string;
  textClassName?: string;
  enabled?: boolean;
  NormalViewFooter?: JSXElementConstructor<Record<string, never>>;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const [value, setValue] = useState<string>(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  if (!selected) {
    return (
      <div className={`${styles.editableText} ${className} ${enabled ? styles.clickable : ''}`}>
        <p className={textClassName} onClick={() => (enabled ? setSelected(true) : undefined)}>
          {text}
        </p>
        <NormalViewFooter />
      </div>
    );
  }
  return (
    <FocusableDiv
      className={`${styles.editableText} ${className}`}
      onFocusLost={() => setSelected(false)}
      autoFocus={true}>
      <div className={`${styles.textAreaContainer} ${textClassName}`}>
        <TextArea value={value} onChange={setValue} autoFocus={true} />
      </div>
      <EditingFooter text={value} disable={() => setSelected(false)} />
    </FocusableDiv>
  );
}
