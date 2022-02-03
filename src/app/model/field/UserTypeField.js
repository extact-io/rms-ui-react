import { UserType } from 'app/model/field/UserType';
import { FieldValidator } from 'core/field/FieldValidator';
import { ValidatableFieldDelegator } from 'core/field/ValidatableFieldDelegator';

class UserTypeFieldValidator extends FieldValidator {
  static INSTANCE = new UserTypeFieldValidator();
  constructor() {
    super();
    this.bindThis(this);
  }
  doValidate(value) {
    if (!value) {
      return null;
    }
    if (!UserType.valueOf(value)) {
      return '選択不可';
    }
    return null;
  }
}

export class UserTypeField extends ValidatableFieldDelegator {
  constructor(value = null, infoMessage = null) {
    super(value, UserTypeFieldValidator.INSTANCE.validate, true, infoMessage);
  }
}
