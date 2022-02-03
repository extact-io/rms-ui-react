import { dateFieldValidator } from 'app/model/field/DateField';
import { MultiFieldValidatorFlow } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';
import { DateUtils } from 'core/utils/DateUtils';

export class EndDateFieldValidator extends MultiFieldValidatorFlow {
  static INSTANCE = new EndDateFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doSingleFieldCheck(value) {
    const ret = dateFieldValidator(value);
    if (ret !== null) {
      return ret;
    }
    return null;
  }
  doMultiFieldCheck(value, context) {
    // 依存先がチェックに使える状態かの確認
    if (context.startDate.error) {
      return null;
    }
    if (context.startDate.dateValue > value) {
      return '開始日より過去';
    }
    return null;
  }
}

export class EndDateField extends ValidatableFieldDelegator {
  constructor(value, infoMessage, validator = EndDateFieldValidator.INSTANCE.validate, format) {
    super(value, validator, true, infoMessage, ['endTime']);
    this.format = format;
  }
  get dateValue() {
    return DateUtils.parseDateIfString(this.value, this.format);
  }
}
