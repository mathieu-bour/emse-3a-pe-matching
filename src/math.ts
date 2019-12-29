import { convert } from './base_converter';

export function toCombination(integer: number, base: number, length: number): number[] {
  const partial: any = convert(integer.toString(), 10, base)
    .split('')
    .map(c => c === '0' ? 0 : parseInt(convert(c, base, 10)), 10);

  console.assert(partial.length <= length);

  if (partial.length === length) {
    return partial;
  } else {
    // prepend zeros
    const diff = length - partial.length;
    const prefix = [...Array(diff)].map(() => 0);
    return [...prefix, ...partial];
  }
}

export function fromCombination(combination: number[], base: number): number {
  const str = combination.map(n => convert(n.toString(), 10, base))
    .join('');

  return parseInt(convert(str, base, 10));
}

/**
 * Check if a array has duplicates.
 * @link https://stackoverflow.com/a/7376645/3728261
 * @param array
 */
export function hasDuplicates(array): boolean {
  return (new Set(array)).size !== array.length;
}

/**
 * Check if the proposed solution violates the given threshold
 * @param matrix
 * @param combination
 * @param threshold
 */
export function violateThreshold(matrix: number[][], combination: number[], threshold): number {
  for (let group = 0; group < combination.length; group++) {
    if (matrix[group][combination[group]] >= threshold) {
      return group;
    }
  }

  return null;
}
