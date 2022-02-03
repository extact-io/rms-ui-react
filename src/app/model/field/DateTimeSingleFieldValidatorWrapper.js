import { FieldValidator } from 'core/field/FieldValidator';
import { parse } from 'date-fns';

export class DateTimeSingleFieldValidatorWrapper extends FieldValidator {
  constructor(format, delegate) {
    super();
    this.bindThis(this);
    this.format = format;
    this.delegate = delegate;
  }
  doValidate(value) {
    // value is String.(not Date)
    const dateOrTime = parse(value, this.format, new Date());
    return this.delegate.doValidate(dateOrTime);
  }
}
