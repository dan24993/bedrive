export function removeEmptyValuesFromObject<T extends Record<string, unknown>>(
  obj: T,
  options?: {copy?: boolean; deep?: boolean; arrays?: boolean},
): T {
  const shouldCopy = options?.copy ?? true;
  const newObj = shouldCopy ? {...obj} : obj;
  Object.keys(newObj).forEach(_key => {
    const key = _key as keyof T;
    if (
      options?.arrays &&
      Array.isArray(newObj[key]) &&
      (newObj[key] as any[]).length === 0
    ) {
      delete newObj[key];
    } else if (
      options?.deep &&
      newObj[key] &&
      typeof newObj[key] === 'object'
    ) {
      newObj[key] = removeEmptyValuesFromObject(newObj[key] as any, options);
      if (Object.keys(newObj[key] as object).length === 0) {
        delete newObj[key];
      }
    } else if (newObj[key] == null || newObj[key] === '') {
      delete newObj[key];
    }
  });
  return shouldCopy ? newObj : obj;
}
