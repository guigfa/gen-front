export class ObjectHelper {
    static removeEmptyKeys(obj: any): any {
      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach((key) => {
          const keyValue = obj[key];
  
          if (
            keyValue &&
            typeof keyValue === 'object' &&
            !(keyValue instanceof Date)
          ) {
            ObjectHelper.removeEmptyKeys(keyValue);
  
            if (Object.keys(keyValue).length === 0) {
              delete obj[key];
            }
          } else if (
            keyValue === 'null' ||
            keyValue === null ||
            keyValue === undefined ||
            keyValue === ''
          ) {
            delete obj[key];
          }
        });
      }
      return obj;
    }
  }
  