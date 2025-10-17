import { LexicalComposer } from '@lexical/react/LexicalComposer';
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
import type { EditorThemeClasses } from 'lexical';
import { ImageDropPlugin } from './LexicalPlugins/ImageDropPlugin';

const theme = {
  root: 'editor-root',
  image: 'editor-image',
} satisfies EditorThemeClasses;

function LexicalTextEditor({ disabled = false }) {
  const initialConfig = {
    namespace: 'EtuUTT Front Editor',
    theme,
    onError: console.error,
    nodes: [
      AutoLinkNode,
      CodeHighlightNode,
      CodeNode,
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
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!disabled && <ToolbarPlugin />}
      <RichTextPlugin
        contentEditable={
          <ContentEditable aria-placeholder={'Enter some text...'} placeholder={<div>Enter some text...</div>} />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={(state) => console.log(state.toJSON())} />
      <EnableDisablePlugin disabled={disabled} />
      <ImagePlugin />
      <ImageDropPlugin />
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
