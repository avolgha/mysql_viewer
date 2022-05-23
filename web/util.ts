export function sortTablesForDisplay(tables: string[], length = 2): string[][] {
  return tables.reduce((acc, cur, index) => {
    if (index % length === 0) {
      acc.push([cur]);
    } else {
      acc[acc.length - 1].push(cur);
    }
    return acc;
  }, [] as string[][]);
}

export function transformToArray<T extends Element>(collection: {
  length: number;
  item(index: number): T | null;
}): T[] {
  const array: T[] = [];
  for (let i = 0; i < collection.length; i++) {
    const item = collection.item(i);
    item && array.push(item);
  }
  return array;
}

export function timeStamp(date = new Date()) {
  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export function idxArray(len: number): number[] {
  const array = new Array(len);
  for (let i = 0; i < len; i++) {
    array.push(i);
  }
  return array;
}
