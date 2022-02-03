import { LangUtils } from 'core/utils/LangUtils';
import { format, parse } from 'date-fns';

export class DateUtils {
  static isDate(obj) {
    return obj instanceof Date;
  }
  static toDisplayFormat(date) {
    return format(date, 'yyyy/MM/dd HH:mm');
  }
  static toJsonFormat(date) {
    return format(date, 'yyyyMMdd HH:mm');
  }
  static parseDateFromJsonFormat(dateString) {
    return DateUtils.parseDateIfString(dateString, 'yyyyMMdd HH:mm');
  }

  static parseDateIfString(value, format) {
    if (LangUtils.isString(value)) {
      return parse(value, format, new Date());
    }
    if (DateUtils.isDate(value)) {
      return value;
    }
    return value;
  }

  static trancateHours(date) {
    date.setHours(0);
    return DateUtils.trancateMinutes(date);
  }

  static trancateMinutes(date) {
    date.setMinutes(0);
    return DateUtils.trancateSeconds(date);
  }

  static trancateSeconds(date) {
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static concatDateTime(date, time) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0,
      0
    );
  }
}
