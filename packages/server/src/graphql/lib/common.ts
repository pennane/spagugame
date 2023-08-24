export const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

export const sample = <T>(a: T[]): T => a[Math.floor(Math.random() * a.length)];
