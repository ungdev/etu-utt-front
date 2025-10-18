import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  IconAlignText4Center,
  IconAlignText4Justify,
  IconAlignText4Left,
  IconAlignText4Right,
  IconBold,
  IconItalic,
  IconNext,
  IconPrevious,
  IconStrikethrough,
  IconUnderline,
} from 'obra-icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../LexicalTextEditor.module.scss';

function Divider() {
  return <div className={styles.divider} />;
}

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => $updateToolbar(), { editor });
      }),
      editor.registerCommand(SELECTION_CHANGE_COMMAND, () => ($updateToolbar(), false), COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_UNDO_COMMAND, (payload) => (setCanUndo(payload), false), COMMAND_PRIORITY_LOW),
      editor.registerCommand(CAN_REDO_COMMAND, (payload) => (setCanRedo(payload), false), COMMAND_PRIORITY_LOW),
    );
  }, [editor, $updateToolbar]);

  return (
    <div className={styles.toolbar} ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className={styles.item}
        aria-label="Undo">
        <IconPrevious />
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className={styles.item}
        aria-label="Redo">
        <IconNext />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`${styles.item} ${isBold ? styles.active : ''}`}
        aria-label="Format Bold">
        <IconBold />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={`${styles.item} ${isItalic ? styles.active : ''}`}
        aria-label="Format Italics">
        <IconItalic />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={`${styles.item} ${isUnderline ? styles.active : ''}`}
        aria-label="Format Underline">
        <IconUnderline />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
        className={`${styles.item} ${isStrikethrough ? styles.active : ''}`}
        aria-label="Format Strikethrough">
        <IconStrikethrough />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={styles.item}
        aria-label="Left Align">
        <IconAlignText4Left />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={styles.item}
        aria-label="Center Align">
        <IconAlignText4Center />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={styles.item}
        aria-label="Right Align">
        <IconAlignText4Right />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={styles.item}
        aria-label="Justify Align">
        <IconAlignText4Justify />
      </button>
    </div>
  );
}
