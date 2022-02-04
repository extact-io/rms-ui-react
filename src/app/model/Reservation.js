import { DateTimeMultiFieldValidatorWrapper } from 'app/model/field/DateTimeMultiFieldValidatorWrapper';
import { DateTimeSingleFieldValidatorWrapper } from 'app/model/field/DateTimeSingleFieldValidatorWrapper';
import { EndDateField, EndDateFieldValidator } from 'app/model/field/EndDateField';
import { EndTimeField, EndTimeFieldValidator } from 'app/model/field/EndTimeField';
import { NoteField } from 'app/model/field/NoteField';
import { StartDateField, StartDateFieldValidator } from 'app/model/field/StartDateField';
import { StartTimeField, StartTimeFieldValidator } from 'app/model/field/StartTimeField';
import { DateUtils } from 'core/utils/DateUtils';
import { format, parse } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = DATE_FORMAT + ' ' + TIME_FORMAT;

const VALIDATORS = {
  START_DATE: new DateTimeSingleFieldValidatorWrapper(
    DATE_FORMAT,
    new StartDateFieldValidator(true) // 過去日許容
  ),
  START_TIME: new DateTimeMultiFieldValidatorWrapper(
    TIME_FORMAT,
    new StartTimeFieldValidator(true) // 過去時刻許容
  ),
  // prettier-ignore
  END_DATE: new DateTimeMultiFieldValidatorWrapper(
    DATE_FORMAT,
    new EndDateFieldValidator()),
  // prettier-ignore
  END_TIME: new DateTimeMultiFieldValidatorWrapper(
    TIME_FORMAT,
    new EndTimeFieldValidator()),
};

// DateFieldのvalueはDateだがDateTimeSingleFieldValidatorWrapperを被
// せることでStringもサポートしている
// なので、valueはコンテキストによってStringとDateの2つのケースがある
// なお、ModelのReservationとしてはStringをデフォルトとしている
export class Reservation {
  static toFields(reservationObject) {
    const startDateTimeFields = convertDateTimeString(reservationObject.startDateTime);
    const endDateTimeFields = convertDateTimeString(reservationObject.endDateTime);
    return {
      id: reservationObject.id,
      startDate: new StartDateField(
        startDateTimeFields[0],
        '終了日以前の日付',
        VALIDATORS.START_DATE.validate,
        DATE_FORMAT
      ),
      startTime: new StartTimeField(
        startDateTimeFields[1],
        null,
        VALIDATORS.START_TIME.validate,
        TIME_FORMAT
      ),
      endDate: new EndDateField(
        endDateTimeFields[0],
        '開始日以降の日付',
        VALIDATORS.END_DATE.validate,
        DATE_FORMAT
      ),
      endTime: new EndTimeField(
        endDateTimeFields[1],
        null,
        VALIDATORS.END_TIME.validate,
        TIME_FORMAT
      ),
      note: new NoteField(reservationObject.note),
      userAccountDto: reservationObject.userAccountDto,
      rentalItemDto: reservationObject.rentalItemDto,
    };
  }

  static toObject(reservationFields) {
    if (!reservationFields) {
      return reservationFields; // null or undefined
    }
    return {
      id: reservationFields.id,
      startDateTime: concatDateTimeObject(
        reservationFields.startDate.value,
        reservationFields.startTime.value
      ),
      endDateTime: concatDateTimeObject(
        reservationFields.endDate.value,
        reservationFields.endTime.value
      ),
      note: reservationFields.note.value,
      userAccountDto: reservationFields.userAccountDto,
      rentalItemDto: reservationFields.rentalItemDto,
    };
  }
}

function convertDateTimeString(dateTimeObject) {
  return [format(dateTimeObject, DATE_FORMAT), format(dateTimeObject, TIME_FORMAT)];
}

function concatDateTimeObject(date, time) {
  if (typeof date === 'string') {
    const dateTimeString = date + ' ' + time;
    return parse(dateTimeString, DATETIME_FORMAT, new Date());
  }
  return DateUtils.concatDateTime(date, time);
}
