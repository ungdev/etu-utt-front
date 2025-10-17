import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { PropsWithoutRef, useEffect } from 'react';

export function EnableDisablePlugin({ disabled }: PropsWithoutRef<{ disabled: boolean }>) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  return <></>;
}
