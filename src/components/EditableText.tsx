import styles from './EditableText.module.scss';
import { JSXElementConstructor, ReactNode, useState } from 'react';
import TextArea from '@/components/UI/TextArea';
import FocusableDiv from '@/components/FocusableDiv';

export default function EditableText({
  text,
  EditingFooter,
  className = '',
  textClassName = '',
  enabled = true,
  children,
}: {
  text: string;
  EditingFooter: JSXElementConstructor<{ text: string; disable: () => void }>;
  className?: string;
  textClassName?: string;
  enabled?: boolean;
  children?: ReactNode;
}) {
  const [selected, setSelected] = useState<boolean>(false);
  const [value, setValue] = useState<string>(text);

  if (!selected) {
    return (
      <div className={`${styles.editableText} ${className} ${enabled ? styles.clickable : ''}`}>
        <p className={textClassName} onClick={() => (enabled ? setSelected(true) : undefined)}>
          {text}
        </p>
        {children}
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
