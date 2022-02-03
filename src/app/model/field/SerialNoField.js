import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class SerialNoFieldValidator extends FieldValidator {
  static INSTANCE = new SerialNoFieldValidator();
  static #PATTERN = new RegExp(/^[a-zA-Z0-9\\-]*$/);
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length > 15) {
      return '文字数オーバー(15文字以内)';
    }
    if (!SerialNoFieldValidator.#PATTERN.test(value)) {
      return '半角英数ハイフン以外の使用不可';
    }
    return null;
  }
}

export class SerialNoField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '15文字以内') {
    super(value, SerialNoFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
