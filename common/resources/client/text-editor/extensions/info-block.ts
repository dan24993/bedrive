import {mergeAttributes, Node} from '@tiptap/react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    important: {
      addInfo: (attributes: {
        type: 'important' | 'warning' | 'success';
      }) => ReturnType;
    };
  }
}

export const InfoBlock = Node.create({
  name: 'be-info-block',
  group: 'block',
  content: 'inline*',
  defining: true,

  addOptions() {
    return {
      types: ['important', 'warning', 'success'],
      defaultType: 'success',
    };
  },

  addAttributes() {
    return {
      type: {
        default: this.options.defaultType,
        parseHTML: element => {
          for (const type of this.options.types) {
            if (element.classList.contains(type)) {
              return type;
            }
          }
          return this.options.defaultType;
        },
        renderHTML: attrs => {
          return {class: attrs.type};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div',
        contentElement: 'p',
        getAttrs: node =>
          (node as HTMLElement).classList.contains('info-block') && null,
      },
    ];
  },

  renderHTML({HTMLAttributes}) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'info-block',
      }),
      ['div', {class: 'title'}, 'Important:'],
      ['p', 0],
    ];
  },

  addCommands() {
    return {
      addInfo:
        attributes =>
        ({commands}) => {
          return commands.setNode(this.name, attributes);
        },
    };
  },
});
