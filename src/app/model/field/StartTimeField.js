import { dateFieldValidator } from 'app/model/field/DateField';
import { MultiFieldValidatorFlow } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';
import { DateUtils } from 'core/utils/DateUtils';

export class StartTimeFieldValidator extends MultiFieldValidatorFlow {
  static INSTANCE = new StartTimeFieldValidator();
  constructor(allowPastTime = false) {
    super();
    this.allowPastTime = allowPastTime;
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
    if (this.allowPastTime) {
      return null;
    }
    // 依存先がチェックに使える状態かの確認
    if (context.startDate.error) {
      return null;
    }
    const compDateTime = DateUtils.concatDateTime(context.startDate.dateValue, value);
    const today = DateUtils.trancateSeconds(new Date());
    if (compDateTime < today) {
      return '時刻が過去';
    }
    return null;
  }
}

export class StartTimeField extends ValidatableFieldDelegator {
  constructor(value, infoMessage, validator = StartTimeFieldValidator.INSTANCE.validate, format) {
    super(value, validator, true, infoMessage, ['endTime']);
    this.format = format;
  }
  get dateValue() {
    return DateUtils.parseDateIfString(this.value, this.format);
  }
}
