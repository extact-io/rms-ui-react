import { NoteField } from 'app/model/field/NoteField';
import { SessionContext } from 'app/provider/SessionContextProvider';
import { TabContext } from 'app/provider/TabContextProvider';
import PanelLayout from 'app/ui/panel/PanelLayout';
import CompleteScreen from 'app/ui/panel/member/reservationflow/CompleteScreen';
import ContentsInputStep from 'app/ui/panel/member/reservationflow/ContentsInputStep';
import ReviewStep from 'app/ui/panel/member/reservationflow/ReviewStep';
import SelectItemStep from 'app/ui/panel/member/reservationflow/SelectItemStep';
import useFromToDateTime from 'app/ui/panel/member/useFromToDateTime';
import React, { useContext, useState } from 'react';
import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  back: {
    fontSize: '1rem',
  },
}));

const steps = ['レンタル品選択', '予約入力', '予約内容確認'];

function getStepContent(stepFlow, reservation) {
  switch (stepFlow.currentStep) {
    case 0:
      return <SelectItemStep stepFlow={stepFlow} reservation={reservation} />;
    case 1:
      return <ContentsInputStep stepFlow={stepFlow} reservation={reservation} />;
    case 2:
      return <ReviewStep stepFlow={stepFlow} reservation={reservation} />;
    default:
      throw new Error('Unknown step');
  }
}

function useReservation(selectedItem) {
  const fromToDateTime = useFromToDateTime();
  const { loginUser } = useContext(SessionContext);
  const [reservationFields, setReservationFields] = useState(() => {
    return {
      item: selectedItem,
      fromToDateTime,
      note: new NoteField(),
    };
  });
  const changeReservation = (value, fieldName) => {
    switch (fieldName) {
      case 'id':
        reservationFields[fieldName] = value;
        break;
      case 'note':
        reservationFields[fieldName].value = value;
        reservationFields[fieldName].validate();
        break;
      case 'item':
        reservationFields[fieldName] = value;
        break;
      default:
        reservationFields.fromToDateTime.changeDateTime(value, fieldName); // object => date
        break;
    }
    setReservationFields({ ...reservationFields });
  };
  const toObjectableFields = () => {
    return {
      startDate: reservationFields.fromToDateTime.startDate,
      startTime: reservationFields.fromToDateTime.startTime,
      endDate: reservationFields.fromToDateTime.endDate,
      endTime: reservationFields.fromToDateTime.endTime,
      note: reservationFields.note,
      userAccountDto: loginUser,
      rentalItemDto: reservationFields.item,
    };
  };
  return {
    ...reservationFields,
    changeReservation,
    toObjectableFields,
  };
}

function useStepFlow(selectedItem) {
  // selectedItemが指定されていたらstep1から開始
  const [currentStep, setCurrentStep] = useState(!selectedItem ? 0 : 1);
  const toNextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const toPrevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  return {
    currentStep,
    toNextStep,
    toPrevStep,
    setCurrentStep,
  };
}

export default function ReservationStep() {
  const classes = useStyles();
  const { keepValue: selectedItem } = useContext(TabContext);
  const stepFlow = useStepFlow(selectedItem);
  const reservation = useReservation(selectedItem);
  return (
    <React.Fragment>
      <PanelLayout>
        <Typography component="h1" variant="h4" align="center">
          レンタル予約
        </Typography>
        <Stepper activeStep={stepFlow.currentStep} className={classes.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {stepFlow.currentStep === steps.length ? (
            /* 完了画面 */
            <CompleteScreen reservation={reservation} />
          ) : (
            /* STEP画面 */
            <React.Fragment>{getStepContent(stepFlow, reservation)}</React.Fragment>
          )}
        </React.Fragment>
      </PanelLayout>
    </React.Fragment>
  );
}
