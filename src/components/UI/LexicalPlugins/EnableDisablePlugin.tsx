import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MutableRefObject, PropsWithRef, useEffect } from 'react';

/**
 * @param disabled
 * @param ref Will contain a function that will allow you to update the editor state.
 */
export function EnableDisablePlugin({
  disabled,
  ref,
}: PropsWithRef<{ disabled: boolean; ref?: MutableRefObject<(s: string) => void> }>) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor?.setEditable(!disabled);

    if (ref) {
      ref.current = (s) => {
        const setEditorState = () => editor.setEditorState(editor.parseEditorState(s));
        editor.update(setEditorState);
      };
    }
  }, [editor, disabled]);

  return <></>;
}
