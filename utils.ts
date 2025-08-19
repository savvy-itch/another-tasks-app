export function padNumber(n: number): string {
  return n.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
}
