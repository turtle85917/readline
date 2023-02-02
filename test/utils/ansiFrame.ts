export const ansiFrame = (value: string, ...styles: number[]) => {
  return `\x1b[${styles.join(';')}m${value}\x1b[0m`;
}
