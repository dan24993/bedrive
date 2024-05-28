export let rootEl = (
  typeof document !== 'undefined'
    ? document.getElementById('root') ?? document.body
    : undefined
) as HTMLElement;

export let themeEl = (
  typeof document !== 'undefined' ? document.documentElement : undefined
) as HTMLElement;

export function setRootEl(el: HTMLElement) {
  rootEl = el;
  themeEl = el;
}
