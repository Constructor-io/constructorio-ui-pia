/**
 * Joins class names, dropping the falsy ones, so a conditional class can be written inline.
 *
 * Deliberately not `clsx` or `classnames`: neither is a dependency of this package, and the copy of
 * `clsx` in the tree belongs to `@constructor-io/constructorio-ui-components`, which is a peer
 * dependency - importing it here would work locally and break in a consumer that hoists
 * differently. Worth revisiting if this ever needs to accept objects or nested arrays.
 */
export const cx = (...parts: (string | false | null | undefined)[]): string =>
  parts.filter(Boolean).join(' ');
