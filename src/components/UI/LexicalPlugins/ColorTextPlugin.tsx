import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $addUpdateTag,
  $create,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  SKIP_SELECTION_FOCUS_TAG,
} from 'lexical';
import { useEffect } from 'react';
import { $createColorTextNodeFromTextNode, $isColorTextNode, ColorTextNode, ColorType } from './ColorTextNode';

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
            const colorNodes = selection
              .getNodes()
              .map((node) => ($isTextNode(node) ? $createColorTextNodeFromTextNode(node, color) : node));
            const lastIndex = colorNodes.length - 1;
            // Order is important here, we must start by the last one in case it is also the first one.
            if ($isColorTextNode(colorNodes[lastIndex]))
              colorNodes[lastIndex] = colorNodes[lastIndex].spliceText(
                selection.isBackward() ? selection.anchor.offset : selection.focus.offset,
                colorNodes[lastIndex].getTextContent().length,
                '',
              );
            if ($isColorTextNode(colorNodes[0]))
              colorNodes[0] = colorNodes[0].spliceText(
                0,
                selection.isBackward() ? selection.focus.offset : selection.anchor.offset,
                '',
              );
            selection.insertNodes(colorNodes);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
