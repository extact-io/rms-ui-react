import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class ItemNameFieldValidator extends FieldValidator {
  static INSTANCE = new ItemNameFieldValidator();
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
    return null;
  }
}

export class ItemNameField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = '15文字以内') {
    super(value, ItemNameFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
