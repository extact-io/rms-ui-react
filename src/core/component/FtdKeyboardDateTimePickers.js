import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, KeyboardTimePicker } from '@material-ui/pickers';

function fillDefaultPropValue(props) {
  // FromToDate => Ftd
  let { id, name, required, value, error, helperText, fromToDateTime, children, ...other } = props;
  // If name is not set, id is set by default
  if (!name) {
    name = id;
  }
  // If fieldValue is set, the derived item is set by default.
  if (fromToDateTime) {
    if (!required) {
      required = fromToDateTime[name].required;
    }
    if (!value) {
      value = fromToDateTime[name].value;
    }
    if (!error) {
      error = fromToDateTime[name].error;
    }
    if (!helperText) {
      helperText = fromToDateTime[name].message;
    }
  }
  return { id, name, required, value, error, helperText, fromToDateTime, children, ...other };
}

const handleDateTimeOnBlur = (fromToDateTime) => (event) => {
  fromToDateTime.processOnInputFixTiming(event.target.id);
};
const handlePickerOnClose = (fromToDateTime) => (id) => {
  fromToDateTime.processOnInputFixTiming(id);
};

function bindContextToDefaultHandler(onBlur, onClose, fromToDateTime) {
  const boundOnBlur = !onBlur ? handleDateTimeOnBlur(fromToDateTime) : onBlur;
  const boundOnClose = !onClose ? handlePickerOnClose(fromToDateTime) : onClose;
  return [boundOnBlur, boundOnClose];
}

function generateKeyboardDateTimePicker(DateTimeComponent, props) {
  const { name, onBlur, onClose, fromToDateTime, children, ...filledProps } =
    fillDefaultPropValue(props);
  const [boundOnBlur, boundOnClose] = bindContextToDefaultHandler(onBlur, onClose, fromToDateTime);
  return (
    <DateTimeComponent
      name={name}
      onBlur={boundOnBlur}
      onClose={() => boundOnClose(name)}
      {...filledProps}
    >
      {children}
    </DateTimeComponent>
  );
}

class JapaneseDateFnsUtils extends DateFnsUtils {
  getCalendarHeaderText(date) {
    return format(date, 'yyyy MMM', { locale: this.locale });
  }
  getDatePickerHeaderText(date) {
    return format(date, 'MMMd日', { locale: this.locale });
  }
}

export function FtdKeyboardDatePicker(props) {
  return generateKeyboardDateTimePicker(KeyboardDatePicker, props);
}

export function FtdKeyboardTimePicker(props) {
  return generateKeyboardDateTimePicker(KeyboardTimePicker, props);
}

export { JapaneseDateFnsUtils };
