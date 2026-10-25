/**
 * Aggregates classNames and filters out falsy values.
 * With this utility, there won't be trailing white spaces in your class attributes anymore !
 */
export function c(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export const Time = {
  getCurrent: () => Date.now(),
  getDate: () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    return new Date(year, month, date);
  },
};
