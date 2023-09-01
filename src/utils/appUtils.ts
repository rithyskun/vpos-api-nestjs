
export class AppUtils {
  constructor() { }

  static formatDateTime(d: Date) {
    return new Date(d).toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: 'numeric',
    });
  }

  static omit = <T extends object, U extends keyof T>(
    item: T,
    ...keys: U[]
  ): {
      [K in Exclude<keyof T, U>]: T[K];
    } => {
    const ret = {} as T;

    let key: keyof T;
    for (key in item) {
      if (!keys.includes(key as U)) {
        ret[key] = item[key];
      }
    }

    return ret;
  };
}
