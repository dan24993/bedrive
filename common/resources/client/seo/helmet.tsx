import {Children, memo, ReactElement} from 'react';
import {shallowEqual} from '../utils/shallow-equal';
import {MetaTag} from './meta-tag';
import {TitleMetaTagChildren} from './static-page-title';
import {useTrans, UseTransReturn} from '../i18n/use-trans';
import {isSsr} from '@common/utils/dom/is-ssr';

const rafPolyfill = (() => {
  let clock = Date.now();

  return (callback: Function) => {
    const currentTime = Date.now();

    if (currentTime - clock > 16) {
      clock = currentTime;
      callback(currentTime);
    } else {
      setTimeout(() => {
        rafPolyfill(callback);
      }, 0);
    }
  };
})();

const cafPolyfill = (id: string | number) => clearTimeout(id);

const requestAnimationFrame = !isSsr()
  ? window.requestAnimationFrame
  : global.requestAnimationFrame || rafPolyfill;

const cancelAnimationFrame = !isSsr()
  ? window.cancelAnimationFrame
  : global.cancelAnimationFrame || cafPolyfill;

export const helmetAttribute = 'data-be-helmet';
let rafId: number | null;

interface HelmetProps {
  children?: ReactElement | ReactElement[];
  tags?: MetaTag[];
}
export const Helmet = memo(({children, tags}: HelmetProps) => {
  const {trans} = useTrans();

  if (isSsr()) return null;

  if (!tags && children) {
    tags = mapChildrenToTags(children, trans);
  }

  updateTags(tags);

  return null;
}, shallowEqual);

function mapChildrenToTags(
  children: ReactElement | ReactElement[],
  trans: UseTransReturn['trans'],
): MetaTag[] {
  return Children.map(children, child => {
    switch (child.type) {
      case 'title':
        return {
          nodeName: 'title',
          _text: titleTagChildrenToString(child.props.children, trans),
        };
      case 'meta':
        return {...child.props, nodeName: 'meta'};
    }
  });
}

function titleTagChildrenToString(
  children: TitleMetaTagChildren,
  trans: UseTransReturn['trans'],
): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(c => titleTagChildrenToString(c, trans)).join('');
  }
  if ('message' in children) {
    return trans(children);
  }
  return trans(children.props);
}

function removeOldTags() {
  if (isSsr()) return;
  document.head
    .querySelectorAll(
      'meta:not([data-keep]), script[type="application/ld+json"]:not([data-keep]), title, link[rel="canonical"]',
    )
    .forEach(tag => {
      document.head.removeChild(tag);
    });
}

function updateTags(tags?: MetaTag[] | string) {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  rafId = requestAnimationFrame(() => {
    removeOldTags();

    if (typeof tags === 'string') {
      const template = document.createElement('template');
      template.innerHTML = tags;
      template.content.childNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          node.setAttribute(helmetAttribute, 'true');
          document.head.prepend(node);
        }
      });
    } else {
      tags?.forEach(tag => {
        updateTag(tag);
      });
    }

    rafId = null;
  });
}

function updateTag(tag: MetaTag) {
  // update title
  if (tag.nodeName === 'title') {
    if (typeof tag._text !== 'undefined' && document.title !== tag._text) {
      document.title = tag._text;
    }
    return;
  }

  // update <meta> tag
  const newElement = document.createElement(tag.nodeName);
  for (const key in tag) {
    const attribute = key as keyof MetaTag;
    if (attribute === 'nodeName') continue;
    if (attribute === '_text') {
      newElement.textContent =
        typeof tag._text === 'string' ? tag._text : JSON.stringify(tag._text);
    } else {
      const value = tag[attribute] == null ? '' : tag[attribute];
      newElement.setAttribute(attribute, value as string);
    }
  }

  newElement.setAttribute(helmetAttribute, 'true');
  document.head.prepend(newElement);
}
