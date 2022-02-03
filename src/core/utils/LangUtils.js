export class LangUtils {
  static isString(obj) {
    return typeof obj == 'string' || obj instanceof String;
  }
  static bindThis(obj) {
    const prototype = Object.getPrototypeOf(obj);
    const propNames = Object.getOwnPropertyNames(prototype);
    propNames.forEach((propName) => {
      const propObject = prototype[propName];
      if (typeof propObject === 'function') {
        obj[propName] = prototype[propName].bind(obj);
      }
    });
  }
}
