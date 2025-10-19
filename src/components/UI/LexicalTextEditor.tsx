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
import { ImageNode } from './LexicalPlugins/ImageNode';
import { $createColorTextNodeFromTextNode, ColorTextNode } from './LexicalPlugins/ColorTextNode';
import { ImageDropPlugin } from './LexicalPlugins/ImageDropPlugin';
import { ColorTextPlugin } from './LexicalPlugins/ColorTextPlugin';
import { ImagePlugin } from './LexicalPlugins/ImagePlugin';
import styles from './LexicalTextEditor.module.scss';
import { TextNode, type EditorThemeClasses } from 'lexical';
import type { FC, MutableRefObject } from 'react';

/**
 * Bundle of features (nodes and plugins) to use in Lexical Editor.
 *
 * Contains:
 * - `nodes`: List of custom nodes to register in Lexical Editor {@link InitialConfigType}
 * - `plugins`: List of Lexical plugins to use in the Editor. Each plugin can be a React
 *              Functional Component (the type you'll get when importing plugins) or an object containing
 *              the plugin as `plugin` property and an `options` property containing props to pass to the
 *              plugin. When adding a plugin, make sure its required nodes are also added in the `nodes` list.
 *
 * **Important Note:** When using {@link ColorTextNode}, make sure to add a node replacement rule to turn
 * any{@link TextNode} into a {@link ColorTextNode} such as described {@link https://lexical.dev/docs/concepts/node-replacement in the docs}.
 */
export type RTEFeatureBundle = {
  nodes: InitialConfigType['nodes'];
  plugins: (FC | { plugin: FC; options: Record<string, unknown> })[];
};

/** Preconfigurations for Editor, see {@link $registerBundle} to create other bundles and {@link RTEFeatureBundle} for types. */
const EDITOR_BUNDLES = {
  '@etuutt/simple': {
    nodes: [],
    plugins: [],
  },
  '@etuutt/full': {
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
    plugins: [
      ImageDropPlugin,
      ImagePlugin,
      ColorTextPlugin,
      LinkPlugin,
      ListPlugin,
      CheckListPlugin,
      TablePlugin,
      TabIndentationPlugin,
      HorizontalRulePlugin,
      MarkdownShortcutPlugin,
      { plugin: AutoLinkPlugin, options: { matchers: MATCHERS } },
    ],
  },
} as Record<string, RTEFeatureBundle>;

/** Theme used to display contents of Editor */
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
  /**
   * The feature bundle to use: custom nodes from used in {@link InitialConfigType} and lexical plugins.
   * This property should not be edited after the component is mounted as Lexical does not support dynamic
   * node list changes. You can use custom bundles if registered with {@link $registerBundle}.
   *
   * Predefined bundles:
   * - `@etuutt/simple`: No extra nodes or plugins, only basic rich text features: bold, italic, underline,
   *                     strikethrough and alignment
   * - `@etuutt/full`: All available nodes and plugins provided by EtuUTT: including images, tables, code blocks,
   *                   colored text, links, lists, horizontal rules, markdown support, quotes, headings, indentation.
   * @default '@etuutt/simple'
   */
  bundle?: string | '@etuutt/simple' | '@etuutt/full';
  /** Whether the Editor should handle inputs and events. This property can be updated at anytime. */
  disabled?: boolean;
  /** The text (or ReactNode) to display when Editor is empty and disabled (property disabled set to true) */
  emptyText?: string;
  /** The text (or ReactNode) to display when Editor is empty and enabled (no property disabled=true) */
  placeholder: string;
  /** The initial state of the Editor, in Lexical's JSON format */
  initialState?: string;
  /** Callback called when the content of the Editor changes, providing the new state in Lexical's JSON format */
  onChange?: (state: string) => void;
  /**
   * A ref to a hook to update Editor state (contents). This hook must be only used when setting different content,
   * not for regular updated sent by `onChange` as state is already retained by Lexical (and it would be a bummer to
   * recompute the whole state for every change).
   */
  setStateRef?: MutableRefObject<(s: string) => void>;
}

/**
 * A Rich Text Editor component based on {@link https://lexical.dev Lexical}, with an onboarded toolbar
 * and support for plugins and custom nodes.
 *
 * Lexical does not support dynamic node list changes, so the `bundle` property should not be changed
 * after the component is mounted. Use {@link $registerBundle} to create and register custom bundles
 * of nodes and plugins to use in the Editor.
 *
 * As Lexical does not use React nodes, the content of the editor is not managed through React state
 * (it is managed through lexical state). The state you provide is an **initial state only**. To get
 * the content of the editor, you can use the `onChange` callback from the props.
 *
 * @example
 * <LexicalTextEditor
 *   placeholder={t('assos:infos.edit.description.placeholder')}
 *   emptyText={t('assos:infos.description.empty')}
 *   initialState={asso!.description}
 *   onChange={console.log}
 *   disabled={!editInfosMode}
 * />
 */
function LexicalTextEditor({
  bundle = '@etuutt/simple',
  placeholder,
  emptyText,
  disabled = false,
  initialState,
  onChange,
  setStateRef,
}: LexicalTextEditorProps) {
  const { nodes, plugins } = EDITOR_BUNDLES[bundle];
  const initialConfig = {
    namespace: 'EtuUTT Front Editor',
    theme,
    onError: console.error,
    nodes,
    editorState: initialState,
  } satisfies InitialConfigType;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {!disabled && <ToolbarPlugin enabledNodes={nodes} />}
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
        <HistoryPlugin />
        <OnChangePlugin onChange={(state) => !disabled && onChange?.(JSON.stringify(state))} />
        <EnableDisablePlugin disabled={disabled} ref={setStateRef} />
        {plugins.map((Plugin, index) =>
          typeof Plugin === 'function' ? <Plugin key={index} /> : <Plugin.plugin key={index} {...Plugin.options} />,
        )}
      </div>
    </LexicalComposer>
  );
}

export default LexicalTextEditor;

/**
 * Registers a new feature bundle for the Lexical Text Editor. A bundle is a set of nodes and plugins
 * that can be used in the Editor.
 * @param name the name used to access to your bundle when intializing the {@link LexicalTextEditor}
 * @param bundle the feature bundle containing nodes and plugins
 */
export function $registerBundle(name: string, bundle: RTEFeatureBundle) {
  if (!(name in EDITOR_BUNDLES)) EDITOR_BUNDLES[name] = bundle;
}

/**
 * Use this function to ensure `str` can be used in a {@link LexicalTextEditor}
 * (either in the `initialState` prop or through the `setStateRef` hook)
 */
export function $makeJson(str: string) {
  try {
    JSON.parse(str);
    return str;
  } catch {
    return (
      `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${str.replaceAll(/\\/g, '\\\\').replaceAll(/"/g, '\\"')}",` +
      `"type":"color-text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],` +
      `"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`
    );
  }
}
