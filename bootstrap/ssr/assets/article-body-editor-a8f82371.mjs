import { jsx } from "react/jsx-runtime";
import { Node, mergeAttributes, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useRef, useEffect } from "react";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { TextAlign } from "@tiptap/extension-text-align";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Extension } from "@tiptap/core";
import { TextSelection, AllSelection } from "prosemirror-state";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import php from "highlight.js/lib/languages/php";
import shell from "highlight.js/lib/languages/shell";
import bash from "highlight.js/lib/languages/bash";
import ruby from "highlight.js/lib/languages/ruby";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import c from "highlight.js/lib/languages/c";
import { bs as useCallbackRef } from "../server-entry.mjs";
import "react-dom/server";
import "process";
import "http";
import "@tanstack/react-query";
import "axios";
import "react-router-dom/server.mjs";
import "framer-motion";
import "clsx";
import "@internationalized/date";
import "nano-memoize";
import "zustand";
import "zustand/middleware/immer";
import "nanoid";
import "@react-aria/utils";
import "@react-aria/focus";
import "@floating-ui/react-dom";
import "react-merge-refs";
import "react-dom";
import "react-router-dom";
import "deepmerge";
import "@internationalized/number";
import "react-hook-form";
import "@react-stately/utils";
import "@react-aria/ssr";
import "dot-object";
import "immer";
import "axios-retry";
import "tus-js-client";
import "react-use-cookie";
import "mime-match";
import "react-use-clipboard";
const BackgroundColor = Extension.create({
  name: "backgroundColor",
  addOptions() {
    return {
      types: ["textStyle"]
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) {
                return {};
              }
              return {
                style: `background-color: ${attributes.backgroundColor}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setBackgroundColor: (backgroundColor) => ({ chain }) => {
        return chain().setMark("textStyle", { backgroundColor }).run();
      },
      unsetBackgroundColor: () => ({ chain }) => {
        return chain().setMark("textStyle", { backgroundColor: null }).removeEmptyTextStyle().run();
      }
    };
  }
});
const Indent = Extension.create({
  name: "indent",
  addOptions: () => {
    return {
      types: ["listItem", "paragraph"],
      minLevel: 0,
      maxLevel: 6
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            renderHTML: (attributes) => {
              return (attributes == null ? void 0 : attributes.indent) > this.options.minLevel ? { "data-indent": attributes.indent } : null;
            },
            parseHTML: (element) => {
              const level = Number(element.getAttribute("data-indent"));
              return level && level > this.options.minLevel ? level : null;
            }
          }
        }
      }
    ];
  },
  addCommands() {
    const setNodeIndentMarkup = (tr, pos, delta) => {
      var _a;
      const node = (_a = tr == null ? void 0 : tr.doc) == null ? void 0 : _a.nodeAt(pos);
      if (node) {
        const nextLevel = (node.attrs.indent || 0) + delta;
        const { minLevel, maxLevel } = this.options;
        const indent = (
          // eslint-disable-next-line no-nested-ternary
          nextLevel < minLevel ? minLevel : nextLevel > maxLevel ? maxLevel : nextLevel
        );
        if (indent !== node.attrs.indent) {
          const { indent: oldIndent, ...currentAttrs } = node.attrs;
          const nodeAttrs = indent > minLevel ? { ...currentAttrs, indent } : currentAttrs;
          return tr.setNodeMarkup(pos, node.type, nodeAttrs, node.marks);
        }
      }
      return tr;
    };
    const updateIndentLevel = (tr, delta) => {
      const { doc, selection } = tr;
      if (doc && selection && (selection instanceof TextSelection || selection instanceof AllSelection)) {
        const { from, to } = selection;
        doc.nodesBetween(from, to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = setNodeIndentMarkup(tr, pos, delta);
            return false;
          }
          return true;
        });
      }
      return tr;
    };
    const applyIndent = (direction) => () => ({ tr, state, dispatch }) => {
      const { selection } = state;
      tr = tr.setSelection(selection);
      tr = updateIndentLevel(tr, direction);
      if (tr.docChanged) {
        dispatch == null ? void 0 : dispatch(tr);
        return true;
      }
      return false;
    };
    return {
      indent: applyIndent(1),
      outdent: applyIndent(-1)
    };
  },
  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        if (editor.state.selection.to > editor.state.selection.from) {
          return this.editor.commands.indent();
        }
        return false;
      },
      "Shift-Tab": ({ editor }) => {
        if (editor.state.selection.to > editor.state.selection.from) {
          return this.editor.commands.outdent();
        }
        return false;
      }
    };
  }
});
const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      allowfullscreen: {
        default: null
      },
      allow: {
        default: "autoplay; fullscreen; picture-in-picture"
      },
      src: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "iframe"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ];
  },
  addCommands() {
    return {
      setEmbed: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  }
});
const highlightMaterialPalenight = "";
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("php", php);
lowlight.register("shell", shell);
lowlight.register("bash", bash);
lowlight.register("ruby", ruby);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("c", c);
const InfoBlock = Node.create({
  name: "be-info-block",
  group: "block",
  content: "inline*",
  defining: true,
  addOptions() {
    return {
      types: ["important", "warning", "success"],
      defaultType: "success"
    };
  },
  addAttributes() {
    return {
      type: {
        default: this.options.defaultType,
        parseHTML: (element) => {
          for (const type of this.options.types) {
            if (element.classList.contains(type)) {
              return type;
            }
          }
          return this.options.defaultType;
        },
        renderHTML: (attrs) => {
          return { class: attrs.type };
        }
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "div",
        contentElement: "p",
        getAttrs: (node) => node.classList.contains("info-block") && null
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "info-block"
      }),
      ["div", { class: "title" }, "Important:"],
      ["p", 0]
    ];
  },
  addCommands() {
    return {
      addInfo: (attributes) => ({ commands }) => {
        return commands.setNode(this.name, attributes);
      }
    };
  }
});
function ArticleBodyEditor({
  initialContent = "",
  children,
  onLoad: _onLoad,
  onCtrlEnter,
  minHeight = "min-h-320",
  autoFocus
}) {
  const onLoad = useCallbackRef(_onLoad);
  const calledOnLoad = useRef(false);
  const extensions = [
    StarterKit.configure({
      codeBlock: false
    }),
    Underline,
    Link.extend({
      inclusive: false,
      validate: {
        // only linkify links that start with a protocol
        url: (value) => /^https?:\/\//.test(value)
      }
    }),
    Image,
    Superscript,
    Subscript,
    TextStyle,
    Color,
    BackgroundColor,
    Indent,
    CodeBlockLowlight.configure({
      lowlight
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"]
    }),
    InfoBlock,
    Embed
  ];
  if (onCtrlEnter) {
    extensions.push(
      Extension.create({
        addKeyboardShortcuts: () => ({
          "Cmd-Enter"() {
            onCtrlEnter();
            return true;
          },
          "Ctrl-Enter"() {
            onCtrlEnter();
            return true;
          }
        })
      })
    );
  }
  const editor = useEditor({
    extensions,
    onFocus: () => {
    },
    autofocus: autoFocus,
    content: initialContent
  });
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
    /* @__PURE__ */ jsx(EditorContent, { className: minHeight, editor }),
    editor
  );
}
export {
  ArticleBodyEditor as default
};
//# sourceMappingURL=article-body-editor-a8f82371.mjs.map
