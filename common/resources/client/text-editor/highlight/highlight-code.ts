export function highlightAllCode(
  el: HTMLElement,
  themeMode: 'light' | 'dark' = 'dark',
) {
  el.querySelectorAll('pre code').forEach(e => {
    highlightCode(e as HTMLElement, themeMode);
  });
}

export async function highlightCode(
  el: HTMLElement,
  themeMode: 'light' | 'dark' = 'dark',
) {
  const {hljs} = await import('@common/text-editor/highlight/highlight');
  if (!el.dataset.highlighted) {
    el.classList.add(themeMode === 'dark' ? 'hljs-dark' : 'hljs-light');
    hljs.highlightElement(el);
  }
}
