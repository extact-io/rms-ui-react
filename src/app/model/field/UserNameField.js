import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class UserNameFieldValidator extends FieldValidator {
  static INSTANCE = new UserNameFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length > 16) {
      return '文字数オーバー(16文字以内)';
    }
    return null;
  }
}

export class UserNameField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '16文字以内') {
    super(value, UserNameFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
