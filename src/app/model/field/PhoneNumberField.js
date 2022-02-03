import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class PhoneNumberFieldValidator extends FieldValidator {
  static INSTANCE = new PhoneNumberFieldValidator();
  static #PATTERN = new RegExp(/^[0-9\\-]*$/);
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length > 14) {
      return '文字数オーバー(14文字以内)';
    }
    if (!PhoneNumberFieldValidator.#PATTERN.test(value)) {
      return '半角数字ハイフン以外の使用不可';
    }
    return null;
  }
}

export class PhoneNumberField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '半角数字ハイフン14文字以内') {
    super(value, PhoneNumberFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
