import { Reservation } from 'app/model/Reservation';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { useCommonStepStyles } from 'app/ui/panel/member/reservationflow/useCommonStepStyles';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import { DateUtils } from 'core/utils/DateUtils';
import React, { useContext, useEffect } from 'react';
import { Button, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';

export default function ReviewStep({ stepFlow, reservation }) {
  const classes = useCommonStepStyles();
  const { backdropState, messageState } = useContext(GlobalContext);
  const handleNext = () => {
    toCompleteStepWithAddReservation();
  };

  const toCompleteStepWithAddReservation = async () => {
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    const reservationObject = Reservation.toObject(reservation.toObjectableFields());
    backdropState.start();
    try {
      const newReservationId = await memberApiFacade.addReservation(reservationObject);
      reservation.changeReservation(newReservationId, 'id');
      stepFlow.toNextStep();
    } catch (error) {
      messageState.pushMessage(error.code, error.message);
    } finally {
      backdropState.end();
    }
  };

  useEffect(() => {
    return () => messageState.clear();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        この内容で予約を行います
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <List disablePadding>
            <ListItem>
              <ListItemText primary="レンタル品" />
              <Typography variant="body1">{`${reservation.item.itemName}(${reservation.item.serialNo})`}</Typography>
            </ListItem>
            <ListItem>
              <ListItemText primary="利用開始日時" />
              <Typography variant="body1">
                {DateUtils.toDisplayFormat(reservation.fromToDateTime.getStartDateTime())}
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemText primary="利用終了日時" />
              <Typography variant="body1">
                {DateUtils.toDisplayFormat(reservation.fromToDateTime.getEndDateTime())}
              </Typography>
            </ListItem>
            <ListItem>
              <ListItemText primary="備考" />
              <Typography variant="body1">{reservation.note.value}</Typography>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button
          onClick={() => stepFlow.toPrevStep()}
          className={`${classes.button} ${classes.back}`}
        >
          前へ戻る
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={false}
          className={classes.button}
        >
          予約する
        </Button>
      </div>
    </React.Fragment>
  );
}
