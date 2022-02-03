import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';
import { isValid } from 'date-fns';

class DateFieldValidator extends FieldValidator {
  static INSTANCE = new DateFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    const ret = dateFieldValidator(value);
    if (ret !== null) {
      return ret;
    }
    return null;
  }
}

export class DateField extends ValidatableFieldDelegator {
  constructor(value, infoMessage = null) {
    super(value, DateFieldValidator.INSTANCE.validate, false, infoMessage);
  }
}

export function dateFieldValidator(value) {
  const valid = isValid(value);
  if (!valid) {
    return '不正な日付';
  }
  return null;
}
