class ValidatableField {
  constructor(value, validator, required = false, infoMessage = null, depended = null) {
    this.value = value;
    this.validator = validator;
    this.required = required;
    this.error = false;
    this.message = infoMessage;
    this.infoMessage = infoMessage;
    this.depended = depended;
  }
  validate(context = null) {
    const result = this.validator(this.value, this.required, context);
    this.error = result === undefined || result !== null;
    this.message = this.error ? result : this.infoMessage;
    return !this.error; // true:success, false:fail
  }
  ok() {
    if (this.required) {
      return this.value !== undefined && this.value !== null && !this.error;
    }
    return !this.error;
  }
  static validateAll(fields) {
    if (!fields) {
      return true;
    }
    let success = true;
    Object.values(fields).forEach((field) => {
      if (!field?.validate) {
        return;
      }
      const result = field.validate(fields);
      success = success ? result : false;
    });
    return success;
  }
  static allOk(fields) {
    if (!fields) {
      return true;
    }
    const errorField = Object.values(fields).find((field) => {
      // find field of error
      if (!field?.validate) {
        return false;
      }
      return !field.ok();
    });
    return !errorField; // true => error field not found.
  }
}

export { ValidatableField };
