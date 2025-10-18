import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $addUpdateTag,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  SKIP_SELECTION_FOCUS_TAG,
} from 'lexical';
import { useEffect } from 'react';
import { $createColorTextNode, ColorTextNode, ColorType } from './ColorTextNode';

export const FORMAT_COLOR_COMMAND = createCommand<ColorType>('FORMAT_COLOR_COMMAND');

export function ColorTextPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ColorTextNode])) throw new Error('ColorTextPlugin: ColorTextNode not registered on editor');

    return editor.registerCommand(
      FORMAT_COLOR_COMMAND,
      (color) => {
        editor.update(() => {
          $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const text = selection.getTextContent();
            const colorNode = $createColorTextNode(text, color);
            selection.insertNodes([colorNode]);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
