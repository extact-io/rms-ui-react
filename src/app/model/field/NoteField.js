import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class NoteFieldValidator extends FieldValidator {
  static INSTANCE = new NoteFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (value.length > 64) {
      return '文字数オーバー(64文字以内)';
    }
    return null;
  }
}

export class NoteField extends ValidatableFieldDelegator {
  constructor(value = '', infoMessage = '64文字以内') {
    super(value, NoteFieldValidator.INSTANCE.validate, false, infoMessage);
  }
}
