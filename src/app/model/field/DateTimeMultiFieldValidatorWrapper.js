import { MultiFieldValidatorFlow } from 'core/field/FieldValidator';
import { parse } from 'date-fns';

export class DateTimeMultiFieldValidatorWrapper extends MultiFieldValidatorFlow {
  constructor(format, delegate) {
    super();
    this.bindThis(this);
    this.format = format;
    this.delegate = delegate;
  }
  doSingleFieldCheck(value) {
    // value is String.(not Date)
    const dateOrTime = parse(value, this.format, new Date());
    return this.delegate.doSingleFieldCheck(dateOrTime);
  }
  doMultiFieldCheck(value, context) {
    // value is String.(not Date)
    const dateOrTime = parse(value, this.format, new Date());
    return this.delegate.doMultiFieldCheck(dateOrTime, context);
  }
}
