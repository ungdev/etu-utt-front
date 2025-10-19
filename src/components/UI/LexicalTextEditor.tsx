import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListNode, ListItemNode } from '@lexical/list';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ToolbarPlugin } from './LexicalPlugins/ToolbarPlugin';
import { EnableDisablePlugin } from './LexicalPlugins/EnableDisablePlugin';
import { MATCHERS } from './LexicalPlugins/AutoLinkMatcherPlugin';
import { ImagePlugin } from './LexicalPlugins/ImagePlugin';
import { ImageNode } from './LexicalPlugins/ImageNode';
import { $createColorTextNodeFromTextNode, ColorTextNode } from './LexicalPlugins/ColorTextNode';
import { ImageDropPlugin } from './LexicalPlugins/ImageDropPlugin';
import { ColorTextPlugin } from './LexicalPlugins/ColorTextPlugin';
import styles from './LexicalTextEditor.module.scss';
import { TextNode, type EditorThemeClasses } from 'lexical';

const theme = {
  root: styles['editor-root'],
  image: styles['editor-image'],
  link: styles['editor-link'],
  text: {
    bold: styles['bold'],
    italic: styles['italic'],
    underline: styles['underline'],
    strikethrough: styles['strikethrough'],
    code: styles['editor-code'],
  },
  quote: styles['editor-quote'],
  hr: styles['editor-horizontal-rule'],
  list: {
    checklist: styles['editor-checklist'],
    listitem: styles['editor-list-item'],
    listitemChecked: styles['editor-list-item-checked'],
    listitemUnchecked: styles['editor-list-item-unchecked'],
    ol: styles['editor-ordered-list'],
    ul: styles['editor-unordered-list'],
  },
  table: styles['editor-table'],
  tableCell: styles['editor-table-cell'],
  tableCellHeader: styles['editor-table-cell-header'],
  tableRow: styles['editor-table-row'],
} satisfies EditorThemeClasses;

interface LexicalTextEditorProps {
  placeholder: string;
  emptyText?: string;
  disabled?: boolean;
}

function LexicalTextEditor({ placeholder, emptyText, disabled = false }: LexicalTextEditorProps) {
  const initialConfig = {
    namespace: 'EtuUTT Front Editor',
    theme,
    onError: console.error,
    nodes: [
      AutoLinkNode,
      CodeHighlightNode,
      CodeNode,
      ColorTextNode,
      HeadingNode,
      HorizontalRuleNode,
      ImageNode,
      LinkNode,
      ListItemNode,
      ListNode,
      TableCellNode,
      TableNode,
      TableRowNode,
      QuoteNode,
      {
        replace: TextNode,
        with: (node: TextNode) => {
          return $createColorTextNodeFromTextNode(node);
        },
        withKlass: ColorTextNode,
      },
    ],
  } satisfies InitialConfigType;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!disabled && <ToolbarPlugin />}
      <div className={styles.placeholderContainer}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder={(disabled && emptyText) || placeholder}
              placeholder={<div className={styles.placeholder}>{(disabled && emptyText) || placeholder}</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ImageDropPlugin />
      </div>
      <HistoryPlugin />
      <OnChangePlugin onChange={(state) => console.log(state.toJSON())} />
      <EnableDisablePlugin disabled={disabled} />
      <ImagePlugin />
      <ColorTextPlugin />
      <LinkPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TablePlugin />
      <TabIndentationPlugin />
      <HorizontalRulePlugin />
      <MarkdownShortcutPlugin />
      <AutoLinkPlugin matchers={MATCHERS} />
    </LexicalComposer>
  );
}

export default LexicalTextEditor;
