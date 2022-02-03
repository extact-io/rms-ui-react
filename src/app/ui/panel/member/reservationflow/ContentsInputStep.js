import { ConfigConsts } from 'app/ConfigConsts';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { TabContext } from 'app/provider/TabContextProvider';
import ReservationStatusDialog from 'app/ui/component/ReservationStatusDialog';
import { useCommonStepStyles } from 'app/ui/panel/member/reservationflow/useCommonStepStyles';
import EditableTextField from 'core/component/EditableTextField';
import {
  FtdKeyboardDatePicker,
  FtdKeyboardTimePicker,
  JapaneseDateFnsUtils,
} from 'core/component/FtdKeyboardDateTimePickers';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import jaLocale from 'date-fns/locale/ja';
import React, { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function ContentsInputStep({ stepFlow, reservation }) {
  const classes = useCommonStepStyles();
  const { backdropState, messageState } = useContext(GlobalContext);
  const { keepValue: selectedItem, switchTab } = useContext(TabContext);
  const [openDialog, setOpenDialog] = useState({ open: false });

  const handleChangeContents = (event, name) => {
    const propName = name || event.target.name;
    const propValue = name ? event : event.target.value;
    reservation.changeReservation(propValue, propName);
  };
  const handleNext = () => {
    toReviewStepWithDuplicateCheck();
  };
  const handleBackToInquiryRentalItem = () => {
    // 選択し直す際にselectedItemをnullクリア
    switchTab(ConfigConsts.MEMBER.PANEL_ID.INQ_RENTAL_ITEM, null);
  };

  const toReviewStepWithDuplicateCheck = async () => {
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    const itemId = reservation.item.id;
    const from = reservation.fromToDateTime.getStartDateTime();
    const to = reservation.fromToDateTime.getEndDateTime();
    backdropState.start();
    try {
      const ok = await memberApiFacade.canRentedItemAtTerm(itemId, from, to);
      if (ok === true) {
        stepFlow.toNextStep();
      } else {
        messageState.pushMessage(null, '希望の期間には別の予約が入っているため予約ができません');
      }
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
        予約内容を入力してください
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ShoppingCartIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="レンタル品"
              secondary={`${reservation.item.itemName}(${reservation.item.serialNo})`}
            />
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              onClick={() => setOpenDialog({ open: true, target: reservation.item })}
            >
              予約状況
            </Button>
          </ListItem>
          <Divider />
        </Grid>
        <MuiPickersUtilsProvider utils={JapaneseDateFnsUtils} locale={jaLocale}>
          <Grid item xs={12} sm={6} style={{ paddingBottom: '0px' }}>
            <FtdKeyboardDatePicker
              id="startDate"
              label="予約開始日"
              margin="dense"
              format="yyyy/MM/dd"
              disablePast
              fromToDateTime={reservation.fromToDateTime}
              onChange={(date) => handleChangeContents(date, 'startDate')}
            />
          </Grid>
          <Grid item xs={12} sm={6} style={{ paddingBottom: '0px' }}>
            <FtdKeyboardTimePicker
              id="startTime"
              label="予約開始時刻"
              margin="dense"
              ampm={false}
              fromToDateTime={reservation.fromToDateTime}
              onChange={(date) => handleChangeContents(date, 'startTime')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FtdKeyboardDatePicker
              id="endDate"
              label="予約終了日"
              margin="dense"
              format="yyyy/MM/dd"
              minDate={reservation.fromToDateTime.startDate.value}
              fromToDateTime={reservation.fromToDateTime}
              onChange={(date) => handleChangeContents(date, 'endDate')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FtdKeyboardTimePicker
              id="endTime"
              label="予約終了時刻"
              margin="dense"
              ampm={false}
              fromToDateTime={reservation.fromToDateTime}
              onChange={(date) => handleChangeContents(date, 'endTime')}
            />
          </Grid>
        </MuiPickersUtilsProvider>
        <Grid item xs={12}>
          <EditableTextField
            id="note"
            label="備考"
            variant="outlined"
            multiline
            rows={2}
            fullWidth
            lineWeight={1}
            editable={true}
            fieldValue={reservation.note}
            onChange={handleChangeContents}
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        {selectedItem !== null ? (
          <Button
            onClick={handleBackToInquiryRentalItem}
            className={`${classes.button} ${classes.back}`}
          >
            選択し直す
          </Button>
        ) : (
          <Button
            onClick={() => stepFlow.toPrevStep()}
            className={`${classes.button} ${classes.back}`}
          >
            前へ戻る
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={!(reservation.fromToDateTime.allOk() && reservation.note.ok())}
          className={classes.button}
        >
          次へ
        </Button>
      </div>
      <ReservationStatusDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
    </React.Fragment>
  );
}
