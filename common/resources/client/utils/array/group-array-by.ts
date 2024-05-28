interface Options<T> {
  map?: (item: T) => T;
}

export function groupArrayBy<T>(
  arr: T[],
  cb: (item: any) => string,
  options?: Options<T>,
): {[key: string]: T[]} {
  const result: {[key: string]: T[]} = {};
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    const bucketCategory = cb(item);
    const bucket = result[bucketCategory];

    item = options?.map ? options.map(arr[i]) : arr[i];

    if (!Array.isArray(bucket)) {
      result[bucketCategory] = [item];
    } else {
      result[bucketCategory].push(item);
    }
  }

  return result;
}
