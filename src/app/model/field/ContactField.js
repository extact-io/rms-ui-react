import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class ContactFieldValidator extends FieldValidator {
  static INSTANCE = new ContactFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length > 40) {
      return '文字数オーバー(40文字以内)';
    }
    return null;
  }
}

export class ContactField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '40文字以内') {
    super(value, ContactFieldValidator.INSTANCE.validate, false, infoMessage);
  }
}
