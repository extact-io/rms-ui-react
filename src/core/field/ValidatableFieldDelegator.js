import { ValidatableField } from 'core/field/ValidatableField';

class ValidatableFieldDelegator {
  #validatableField;
  constructor(value, validator, required = false, infoMessage = null, depended = null) {
    this.#validatableField = new ValidatableField(
      value,
      validator,
      required,
      infoMessage,
      depended
    );
  }
  get value() {
    return this.#validatableField.value;
  }
  set value(value) {
    this.#validatableField.value = value;
  }
  get required() {
    return this.#validatableField.required;
  }
  get error() {
    return this.#validatableField.error;
  }
  set error(error) {
    this.#validatableField.error = error;
  }
  get message() {
    return this.#validatableField.message;
  }
  set message(message) {
    this.#validatableField.message = message;
  }
  set infoMessage(infoMessage) {
    this.#validatableField.infoMessage = infoMessage;
    this.#validatableField.message = infoMessage;
  }
  get depended() {
    return this.#validatableField.depended;
  }
  validate(context) {
    return this.#validatableField.validate(context);
  }
  ok() {
    return this.#validatableField.ok();
  }
}
export { ValidatableFieldDelegator };
