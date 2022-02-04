import { EndDateField } from 'app/model/field/EndDateField';
import { EndTimeField } from 'app/model/field/EndTimeField';
import { StartDateField } from 'app/model/field/StartDateField';
import { StartTimeField } from 'app/model/field/StartTimeField';
import { DateUtils } from 'core/utils/DateUtils';
import {
  addDays,
  addHours,
  addMinutes,
  differenceInCalendarDays,
  differenceInMinutes,
  isValid,
} from 'date-fns';
import { useState } from 'react';

export default function useFromToDateTime(baseline = new Date(Date.now())) {
  const [dateTimeFields, setDateTimeFields] = useState(() => {
    const startDate = new StartDateField(initStartDate(baseline), '指定は現在日時以降のみ');
    const startTime = new StartTimeField(initStartTime(baseline));
    const endDate = new EndDateField(initEndDate(startDate.value));
    const endTime = new EndTimeField(initEndTime(startTime.value));
    return {
      startDate,
      startTime,
      endDate,
      endTime,
      old: {
        startDate: { value: startDate.value },
        startTime: { value: startTime.value },
        endDate: { value: endDate.value },
        endTime: { value: endTime.value },
      },
    };
  });

  const changeDateTime = (date, fieldName) => {
    dateTimeFields[fieldName].value = date;
    dateTimeFields[fieldName].validate(dateTimeFields);
    setDateTimeFields({ ...dateTimeFields });
  };

  const getStartDateTime = () => {
    return DateUtils.concatDateTime(dateTimeFields.startDate.value, dateTimeFields.startTime.value);
  };

  const getEndDateTime = () => {
    return DateUtils.concatDateTime(dateTimeFields.endDate.value, dateTimeFields.endTime.value);
  };

  const checkMultiFields = (changeField) => {
    if (!dateTimeFields[changeField].depended) {
      return;
    }
    const dependedFieldNames = dateTimeFields[changeField].depended;
    [...dependedFieldNames].forEach((dep) => {
      dateTimeFields[dep].validate(dateTimeFields);
    });
    setDateTimeFields({ ...dateTimeFields });
  };

  // onBlurかPickerのonCloseが入力の確定タイミングとなるのでそのタイミングでこのメソッドを呼び出し調整することを想定
  // 入力途中の開始日との比較とならないように入力確定タイミングで前回入力確定時の値をoldに持っておく
  const adjustByChangeOfStartDate = () => {
    if (dateTimeFields.startDate.error) {
      return;
    }
    if (dateTimeFields.endDate.error) {
      // 調整は行わないがstartDateは確定しているのでoldに保存しておく
      dateTimeFields.old.startDate.value = dateTimeFields.startDate.value;
      setDateTimeFields({ ...dateTimeFields });
      return;
    }

    const diff = differenceInCalendarDays(
      dateTimeFields.endDate.value,
      dateTimeFields.old.startDate.value
    );
    const adjustedEndDate = addDays(dateTimeFields.startDate.value, diff);
    if (!isValid(adjustedEndDate)) {
      console.log('adjustByChangeOfStartDateでadjustedEndDateの導出に失敗しました');
      return;
    }

    dateTimeFields.endDate.value = adjustedEndDate;
    dateTimeFields.old.startDate.value = dateTimeFields.startDate.value;

    setDateTimeFields({ ...dateTimeFields });
  };

  // 考え方はadjustByChangeOfStartDateと同じ
  const adjustByChangeOfStartTime = () => {
    if (dateTimeFields.startTime.error) {
      return;
    }
    if (
      dateTimeFields.startDate.error ||
      dateTimeFields.endDate.error ||
      dateTimeFields.endTime.error
    ) {
      dateTimeFields.old.startTime.value = dateTimeFields.startTime.value;
      setDateTimeFields({ ...dateTimeFields });
      return;
    }

    const compEndDateTime = getEndDateTime();
    const compStartDateTime = DateUtils.concatDateTime(
      dateTimeFields.startDate.value,
      dateTimeFields.old.startTime.value // 開始時間は変更確定前の値
    );
    const diff = differenceInMinutes(compEndDateTime, compStartDateTime);
    const adjustedEndDateTime = addMinutes(getStartDateTime(), diff);
    if (!isValid(adjustedEndDateTime)) {
      console.log('adjustByChangeOfStartTimeでadjustedEndDateTimeの導出に失敗しました');
      return;
    }

    dateTimeFields.endDate.value = DateUtils.trancateHours(new Date(adjustedEndDateTime.getTime()));
    dateTimeFields.endTime.value = DateUtils.trancateSeconds(
      new Date(adjustedEndDateTime.getTime())
    );
    dateTimeFields.old.startTime.value = dateTimeFields.startTime.value;

    setDateTimeFields({ ...dateTimeFields });
  };

  const adjust = {
    startDate: adjustByChangeOfStartDate,
    startTime: adjustByChangeOfStartTime,
  };

  const checkStartDateTimePastNow = () => {
    const result = dateTimeFields.startTime.validate(dateTimeFields);
    setDateTimeFields({ ...dateTimeFields });
    return result;
  };

  const processOnInputFixTiming = (fieldName) => {
    if (adjust[fieldName]) {
      adjust[fieldName]();
    }
    checkMultiFields(fieldName);
  };

  const allOk = () => {
    return (
      dateTimeFields.startDate.ok() &&
      dateTimeFields.startTime.ok() &&
      dateTimeFields.endDate.ok() &&
      dateTimeFields.endTime.ok()
    );
  };

  return {
    ...dateTimeFields,
    changeDateTime,
    getStartDateTime,
    getEndDateTime,
    adjust,
    checkStartDateTimePastNow,
    processOnInputFixTiming,
    allOk,
  };
}

function initStartDate(baseline) {
  let date = addHours(baseline.getTime(), 1);
  return DateUtils.trancateHours(date);
}
function initStartTime(baseline) {
  let date = addHours(baseline.getTime(), 1);
  return DateUtils.trancateMinutes(date);
}
function initEndDate(baseline) {
  let date = addDays(baseline.getTime(), 1);
  return DateUtils.trancateHours(date);
}
function initEndTime(baseline) {
  return new Date(baseline.getTime());
}
