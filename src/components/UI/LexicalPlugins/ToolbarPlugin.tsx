import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  $addUpdateTag,
  $createParagraphNode,
  $findMatchingParent,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  SKIP_SELECTION_FOCUS_TAG,
  TextNode,
  UNDO_COMMAND,
} from 'lexical';
import {
  IconAlignText4Center,
  IconAlignText4Justify,
  IconAlignText4Left,
  IconAlignText4Right,
  IconBold,
  IconChecklist,
  IconCode,
  IconImage,
  IconItalic,
  IconLink,
  IconNext,
  IconOrderedList,
  IconPalette,
  IconPrevious,
  IconQuoteFill,
  IconStrikethrough,
  IconTable,
  IconText,
  IconUnderline,
  IconUnorderedList,
} from 'obra-icons-react';
import { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../LexicalTextEditor.module.scss';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { $isAtNodeEnd, $setBlocksType } from '@lexical/selection';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isTableNode, $isTableSelection, INSERT_TABLE_COMMAND } from '@lexical/table';
import Input from '../Input';
import { useAppTranslation } from '@/lib/i18n';
import { useAPI } from '@/api/api';
import { uploadFile } from './ImageDropPlugin';
import { FORMAT_COLOR_COMMAND } from './ColorTextPlugin';

function Divider() {
  return <div className={styles.divider} />;
}

type ToolbarFloatingMenuProps = PropsWithChildren<{ display: boolean }>;
export function ToolbarFloatingMenu({ children, display }: ToolbarFloatingMenuProps) {
  return (
    <>
      {display && (
        <div className={styles.floatingMenu} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </>
  );
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
  const [isCode, setIsCode] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<string>('');
  const [align, setAlign] = useState('left');
  const [blockType, setBlockType] = useState<string | null>(null);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [isTablePaletteOpen, setIsTablePaletteOpen] = useState(false);
  const [tablePaletteHoverIndex, setTablePaletteHoverIndex] = useState(-1);
  const [isLinkPaletteOpen, setIsLinkPaletteOpen] = useState(false);
  const [isFilePaletteOpen, setIsFilePaletteOpen] = useState(false);
  const { t } = useAppTranslation();
  const api = useAPI();

  function $findTopLevelElement(node: LexicalNode) {
    let topLevelElement =
      node.getKey() === 'root'
        ? node
        : $findMatchingParent(node, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });
    if (topLevelElement === null) topLevelElement = node.getTopLevelElementOrThrow();
    return topLevelElement;
  }

  function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) return anchorNode;
    return selection.isBackward()
      ? $isAtNodeEnd(selection.focus)
        ? anchorNode
        : focusNode
      : $isAtNodeEnd(selection.anchor)
        ? anchorNode
        : focusNode;
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
    if ($isRangeSelection(selection)) {
      const anchorNode = selection!.anchor.getNode();
      const element = $findTopLevelElement(anchorNode);
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      let type: string | null = null;
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
          type = parentList ? parentList.getListType() : element.getListType();
        } else type = $isHeadingNode(element) ? element.getTag() : (element.getType() as 'paragraph' | 'quote');
      }

      const node = getSelectedNode(selection);
      const parent = node.getParent();
      let alignCheckNode: LexicalNode = node;
      let link: string | null = null;
      if ($isLinkNode(parent)) link = parent.getURL();
      if ($isLinkNode(node)) {
        link = node.getURL();
        alignCheckNode = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline(),
        )!;
      }
      setLink(link);
      if ($findMatchingParent(node, $isTableNode)) type === 'table';

      setBlockType(type);
      setAlign(
        $isElementNode(alignCheckNode)
          ? alignCheckNode.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      );
    }
  }, []);

  const toggleToolbarFloatingMenu = (type: 'color' | 'table' | 'link' | 'file') => {
    setIsColorPaletteOpen(type === 'color' ? !isColorPaletteOpen : false);
    setIsTablePaletteOpen(type === 'table' ? !isTablePaletteOpen : false);
    setIsLinkPaletteOpen(type === 'link' ? !isLinkPaletteOpen : false);
    setIsFilePaletteOpen(type === 'file' ? !isFilePaletteOpen : false);
    if (type === 'link' && !isLinkPaletteOpen) setEditingLink(link || '');
  };

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
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className={styles.item}
        aria-label="Undo">
        <IconPrevious />
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className={styles.item}
        aria-label="Redo">
        <IconNext />
      </button>
      <Divider />
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`${styles.item} ${isBold ? styles.active : ''}`}
        aria-label="Format Bold">
        <IconBold />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`${styles.item} ${isItalic ? styles.active : ''}`}
        aria-label="Format Italics">
        <IconItalic />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`${styles.item} ${isUnderline ? styles.active : ''}`}
        aria-label="Format Underline">
        <IconUnderline />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`${styles.item} ${isStrikethrough ? styles.active : ''}`}
        aria-label="Format Strikethrough">
        <IconStrikethrough />
      </button>
      <button onClick={() => toggleToolbarFloatingMenu('color')} className={styles.item} aria-label="Format Text Color">
        <IconPalette />
        <ToolbarFloatingMenu display={isColorPaletteOpen}>
          <div
            className={[styles['color-palette'], styles['color-palette-blue']].join(' ')}
            onClick={() => (setIsColorPaletteOpen(false), editor.dispatchCommand(FORMAT_COLOR_COMMAND, 'blue'))}
          />
          <div
            className={[styles['color-palette'], styles['color-palette-darkblue']].join(' ')}
            onClick={() => (setIsColorPaletteOpen(false), editor.dispatchCommand(FORMAT_COLOR_COMMAND, 'darkblue'))}
          />
          <div
            className={[styles['color-palette'], styles['color-palette-grey']].join(' ')}
            onClick={() => (setIsColorPaletteOpen(false), editor.dispatchCommand(FORMAT_COLOR_COMMAND, 'grey'))}
          />
          <div
            className={[styles['color-palette'], styles['color-palette-darkgrey']].join(' ')}
            onClick={() => (setIsColorPaletteOpen(false), editor.dispatchCommand(FORMAT_COLOR_COMMAND, 'darkgrey'))}
          />
        </ToolbarFloatingMenu>
      </button>
      <Divider />
      <button
        onClick={() => formatParagraph(editor)}
        className={`${styles.item} ${blockType === 'paragraph' ? styles.active : ''}`}
        aria-label="Format Paragraph">
        <IconText />
      </button>
      <button
        onClick={() => formatHeading(editor, blockType, 'h1')}
        className={`${styles.item} ${blockType === 'h1' ? styles.active : ''}`}
        aria-label="Format H1">
        H1
      </button>
      <button
        onClick={() => formatHeading(editor, blockType, 'h2')}
        className={`${styles.item} ${blockType === 'h2' ? styles.active : ''}`}
        aria-label="Format H2">
        H2
      </button>
      <button
        onClick={() => formatHeading(editor, blockType, 'h3')}
        className={`${styles.item} ${blockType === 'h3' ? styles.active : ''}`}
        aria-label="Format H3">
        H3
      </button>
      <button
        onClick={() => formatQuote(editor, blockType)}
        className={`${styles.item} ${blockType === 'quote' ? styles.active : ''}`}
        aria-label="Format Quote">
        <IconQuoteFill />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={`${styles.item} ${isCode ? styles.active : ''}`}
        aria-label="Format Code">
        <IconCode />
      </button>
      <button
        onClick={() => formatBulletList(editor, blockType)}
        className={`${styles.item} ${blockType === 'bullet' ? styles.active : ''}`}
        aria-label="Format Bullet List">
        <IconUnorderedList />
      </button>
      <button
        onClick={() => formatNumberedList(editor, blockType)}
        className={`${styles.item} ${blockType === 'number' ? styles.active : ''}`}
        aria-label="Format Numbered List">
        <IconOrderedList />
      </button>
      <button
        onClick={() => formatCheckList(editor, blockType)}
        className={`${styles.item} ${blockType === 'check' ? styles.active : ''}`}
        aria-label="Format Check List">
        <IconChecklist />
      </button>
      <button
        onClick={() => toggleToolbarFloatingMenu('table')}
        className={`${styles.item} ${blockType === 'table' ? styles.active : ''}`}
        aria-label="Format Table">
        <IconTable />
        <ToolbarFloatingMenu display={isTablePaletteOpen && blockType !== 'table'}>
          {Array.from({ length: 8 * 8 }).map((_, index) => (
            <div
              key={index}
              className={[
                styles['table-palette'],
                tablePaletteHoverIndex >= index && (tablePaletteHoverIndex % 8) - (index % 8) >= 0 && styles['active'],
              ]
                .filter((c) => c)
                .join(' ')}
              onClick={() => (setIsTablePaletteOpen(false), setTablePaletteHoverIndex(-1), formatTable(editor, index))}
              onMouseEnter={() => setTablePaletteHoverIndex(index)}
              onMouseLeave={() => setTablePaletteHoverIndex(-1)}
            />
          ))}
        </ToolbarFloatingMenu>
      </button>
      <Divider />
      <button
        onClick={() => toggleToolbarFloatingMenu('link')}
        className={`${styles.item} ${typeof link === 'string' ? styles.active : ''}`}
        aria-label="Format Link">
        <IconLink />
        <ToolbarFloatingMenu display={isLinkPaletteOpen}>
          <Input
            className={styles['link-palette']}
            type="url"
            placeholder="https://..."
            value={editingLink}
            onChange={setEditingLink}
            onEnter={(event) => {
              event!.stopPropagation();
              event!.preventDefault();
              setEditingLink('');
              setIsLinkPaletteOpen(false);
              formatLink(editor, editingLink);
            }}
          />
        </ToolbarFloatingMenu>
      </button>
      <button onClick={() => toggleToolbarFloatingMenu('file')} className={styles.item} aria-label="Upload Image">
        <IconImage />
        <ToolbarFloatingMenu display={isFilePaletteOpen}>
          <label className={styles['file-palette']}>
            {t('common:rte.toolbar.uploadImage')}
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg,image/avif,image/tiff"
              onChange={(event) => (
                setIsFilePaletteOpen(false), event.target.files?.[0] && uploadFile(event.target.files[0], api, editor)
              )}
            />
          </label>
        </ToolbarFloatingMenu>
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className={`${styles.item} ${align === 'left' ? styles.active : ''}`}
        aria-label="Left Align">
        <IconAlignText4Left />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className={`${styles.item} ${align === 'center' ? styles.active : ''}`}
        aria-label="Center Align">
        <IconAlignText4Center />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className={`${styles.item} ${align === 'right' ? styles.active : ''}`}
        aria-label="Right Align">
        <IconAlignText4Right />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className={`${styles.item} ${align === 'justify' ? styles.active : ''}`}
        aria-label="Justify Align">
        <IconAlignText4Justify />
      </button>
    </div>
  );
}

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
    const selection = $getSelection();
    $setBlocksType(selection, () => $createParagraphNode());
  });
};

export const formatHeading = (editor: LexicalEditor, blockType: string | null, headingSize: HeadingTagType) => {
  if (blockType !== headingSize) {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      const selection = $getSelection();
      $setBlocksType(selection, () => $createHeadingNode(headingSize));
    });
  }
};

export const formatBulletList = (editor: LexicalEditor, blockType: string | null) => {
  if (blockType !== 'bullet') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    });
  } else {
    formatParagraph(editor);
  }
};

export const formatCheckList = (editor: LexicalEditor, blockType: string | null) => {
  if (blockType !== 'check') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    });
  } else {
    formatParagraph(editor);
  }
};

export const formatNumberedList = (editor: LexicalEditor, blockType: string | null) => {
  if (blockType !== 'number') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    });
  } else {
    formatParagraph(editor);
  }
};

export const formatQuote = (editor: LexicalEditor, blockType: string | null) => {
  if (blockType !== 'quote') {
    editor.update(() => {
      $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
      const selection = $getSelection();
      $setBlocksType(selection, () => $createQuoteNode());
    });
  }
};

export const formatTable = (editor: LexicalEditor, cellIndex: number) => {
  editor.update(() => {
    $addUpdateTag(SKIP_SELECTION_FOCUS_TAG);
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: `${1 + (cellIndex % 8)}`,
      rows: `${1 + Math.floor(cellIndex / 8)}`,
    });
  });
};

export const formatLink = (editor: LexicalEditor, url: string) => {
  editor.update(() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null));
};
