import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MutableRefObject, PropsWithRef, useEffect } from 'react';

export function EnableDisablePlugin({
  disabled,
  ref,
}: PropsWithRef<{ disabled: boolean; ref?: MutableRefObject<(s: string) => void> }>) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor?.setEditable(!disabled);
    if (ref) ref.current = (s) => editor.update(() => editor.setEditorState(editor.parseEditorState(s)));
  }, [editor, disabled]);

  return <></>;
}
