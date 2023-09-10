export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

export const sample = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

const regexCharactersToEscape = /[\\^$.*+?()[\]{}|]/g;
const hasEscapeRegexCharacters = RegExp(regexCharactersToEscape.source);

export const escapeRegex = (string: string): string =>
  hasEscapeRegexCharacters.test(string)
    ? string.replace(regexCharactersToEscape, "\\$&")
    : string;

export const randomIntBetweenInclusive = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min);
