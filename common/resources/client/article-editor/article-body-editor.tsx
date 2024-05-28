import {Editor, EditorContent, FocusPosition, useEditor} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {Underline} from '@tiptap/extension-underline';
import {Link as LinkExtension} from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {ReactElement, useEffect, useRef} from 'react';
import {Superscript} from '@tiptap/extension-superscript';
import {Subscript} from '@tiptap/extension-subscript';
import {Color} from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import {TextAlign} from '@tiptap/extension-text-align';
import {CodeBlockLowlight} from '@tiptap/extension-code-block-lowlight';
import {BackgroundColor} from '@common/text-editor/extensions/background-color';
import {Indent} from '@common/text-editor/extensions/indent';
import {Embed} from '@common/text-editor/extensions/embed';
import {lowlight} from '@common/text-editor/highlight/lowlight';
import {InfoBlock} from '@common/text-editor/extensions/info-block';
import {useCallbackRef} from '@common/utils/hooks/use-callback-ref';
import {Extension} from '@tiptap/core';

interface Props {
  initialContent?: string;
  onLoad?: (editor: Editor) => void;
  children: (content: ReactElement, editor: Editor) => ReactElement;
  minHeight?: string;
  onCtrlEnter?: () => void;
  autoFocus?: FocusPosition;
}
export default function ArticleBodyEditor({
  initialContent = '',
  children,
  onLoad: _onLoad,
  onCtrlEnter,
  minHeight = 'min-h-320',
  autoFocus,
}: Props) {
  const onLoad = useCallbackRef(_onLoad);
  const calledOnLoad = useRef(false);

  const extensions = [
    StarterKit.configure({
      codeBlock: false,
    }),
    Underline,
    LinkExtension.extend({
      inclusive: false,
      validate: {
        // only linkify links that start with a protocol
        url: (value: string) => /^https?:\/\//.test(value),
      },
    }),
    Image,
    Superscript,
    Subscript,
    TextStyle,
    Color,
    BackgroundColor,
    Indent,
    CodeBlockLowlight.configure({
      lowlight,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    InfoBlock,
    Embed,
  ];

  if (onCtrlEnter) {
    extensions.push(
      Extension.create({
        addKeyboardShortcuts: () => ({
          'Cmd-Enter'() {
            onCtrlEnter();
            return true;
          },
          'Ctrl-Enter'() {
            onCtrlEnter();
            return true;
          },
        }),
      }),
    );
  }

  const editor = useEditor({
    extensions,
    onFocus: () => {},
    autofocus: autoFocus,
    content: initialContent,
  });

  // destroy editor
  useEffect(() => {
    if (editor) {
      return () => editor.destroy();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  if (editor && onLoad && !calledOnLoad.current) {
    onLoad(editor);
    calledOnLoad.current = true;
  }

  return children(
    <EditorContent className={minHeight} editor={editor} />,
    editor,
  );
}
