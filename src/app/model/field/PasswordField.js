import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class PasswordFieldValidator extends FieldValidator {
  static INSTANCE = new PasswordFieldValidator();
  static #PATTERN = new RegExp(/^[a-zA-Z0-9!-/:-@¥[-`{-~]*$/);
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length <= 5) {
      return '文字数不足(5文字以上)';
    }
    if (value.length > 10) {
      return '文字数オーバー(10文字以内)';
    }
    if (!PasswordFieldValidator.#PATTERN.test(value)) {
      return '半角英数記号以外の使用不可';
    }
    return null;
  }
}

export class PasswordField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '半角5文字以上10文字以下') {
    super(value, PasswordFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
