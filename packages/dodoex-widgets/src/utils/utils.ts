export const increaseArray = (len: number) => {
  return Object.keys(new Array(len + 1).join(','));
};

export function isNotEmpty(str: string | number | null | undefined): boolean {
  return str !== null && str !== undefined && str !== '';
}
