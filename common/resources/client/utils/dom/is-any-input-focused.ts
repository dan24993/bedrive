export function isAnyInputFocused(doc?: Document): boolean {
  if (!doc) {
    doc = document;
  }
  return doc.activeElement
    ? ['INPUT', 'TEXTAREA'].includes(doc.activeElement.tagName) ||
        (doc.activeElement as HTMLElement).isContentEditable
    : false;
}
