import { dateFieldValidator } from 'app/model/field/DateField';
import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';
import { DateUtils } from 'core/utils/DateUtils';

export class StartDateFieldValidator extends FieldValidator {
  static INSTANCE = new StartDateFieldValidator();
  constructor(allowPastDate = false) {
    super();
    this.allowPastDate = allowPastDate;
    this.bindThis(this);
  }
  doValidate(value) {
    // value is Date.
    const ret = dateFieldValidator(value);
    if (ret !== null) {
      return ret;
    }
    if (this.allowPastDate) {
      return null;
    }
    const today = DateUtils.trancateHours(new Date());
    const compDate = DateUtils.trancateHours(new Date(value.getTime()));
    if (compDate < today) {
      return '過去の日付';
    }
    return null;
  }
}

export class StartDateField extends ValidatableFieldDelegator {
  constructor(value, infoMessage, validator = StartDateFieldValidator.INSTANCE.validate, formt) {
    super(value, validator, true, infoMessage, ['startTime', 'endDate', 'endTime']);
    this.format = formt;
  }
  get dateValue() {
    return DateUtils.parseDateIfString(this.value, this.format);
  }
}
