import { dateFieldValidator } from 'app/model/field/DateField';
import { MultiFieldValidatorFlow } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';
import { DateUtils } from 'core/utils/DateUtils';

export class EndTimeFieldValidator extends MultiFieldValidatorFlow {
  static INSTANCE = new EndTimeFieldValidator();
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
    if (context.startDate.error || context.startTime.error || context.endDate.error) {
      return null;
    }
    const compStartDateTime = DateUtils.concatDateTime(
      context.startDate.dateValue,
      context.startTime.dateValue
    );
    const compEndDateTime = DateUtils.concatDateTime(context.endDate.dateValue, value);

    if (compStartDateTime > compEndDateTime) {
      return '開始時より過去';
    }
    return null;
  }
}

export class EndTimeField extends ValidatableFieldDelegator {
  constructor(value, infoMessage, validator = EndTimeFieldValidator.INSTANCE.validate, format) {
    super(value, validator, true, infoMessage, []);
    this.format = format;
  }
  get dateValue() {
    return DateUtils.parseDateIfString(this.value, this.format);
  }
}
