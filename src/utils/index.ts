/**
 * Aggregates classNames and filters out falsy values.
 * With this utility, there won't be trailing white spaces in your class attributes anymore !
 */
export function c(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
