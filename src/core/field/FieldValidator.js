class FieldValidator {
  // after change to TypeScript, make it Interface.
  constructor() {}
  bindThis(object) {
    this.validate = this.validate.bind(object);
  }
  validate(value, required) {
    if (!value) {
      if (required) {
        return '入力必須';
      }
      return null;
    }
    return this.doValidate(value, required);
  }
  doValidate() {
    throw Error('not overridden');
  }
}

class MultiFieldValidatorFlow extends FieldValidator {
  constructor() {
    super();
  }
  validate(value, required, context = null) {
    if (!value) {
      if (required) {
        return '入力必須';
      }
      return null;
    }
    const ret = this.doSingleFieldCheck(value, required);
    if (ret != null) {
      return ret;
    }
    return this.doMultiFieldCheck(value, context, required);
  }
  doSingleFieldCheck() {
    throw Error('not overridden');
  }
  doMultiFieldCheck() {
    throw Error('not overridden');
  }
}

export { FieldValidator, MultiFieldValidatorFlow };
