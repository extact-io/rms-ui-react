import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { FetchInformation } from 'app/ui/component/FetchInformation';
import { useFetchState } from 'core/hook/useFetchState';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import { DateUtils } from 'core/utils/DateUtils';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[100],
  },
  title: {
    flex: '1 1 100%',
  },
}));

export default function ReservationStatusDialog({ openDialog, setOpenDialog }) {
  const classes = useStyles();
  const { messageState } = useContext(GlobalContext);
  const fetchState = useFetchState(messageState);

  const handleClose = () => setOpenDialog({ open: false });

  useEffect(() => {
    if (!openDialog.open) {
      return;
    }
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    fetchState.invokeFetch(() =>
      memberApiFacade.findReservationByRentalItemId(openDialog.target.id)
    );
  }, [openDialog.open]);

  return (
    <Dialog open={openDialog.open} onClose={handleClose}>
      {openDialog.open && (
        <React.Fragment>
          <DialogContent>
            <DialogTitle>利用状況ダイアログ</DialogTitle>
            <DialogContentText>{`${openDialog.target.itemName} の予約状況`}</DialogContentText>
            <FetchInformation fetchState={fetchState} notFoundMessage={'予約はありません'} />
            {fetchState.shouldRenerRows() && (
              <TableContainer>
                <Table>
                  <TableHead className={classes.head}>
                    <TableRow>
                      <TableCell align="center" variant="head">
                        予約番号
                      </TableCell>
                      <TableCell align="left" variant="head">
                        利用開始日時
                      </TableCell>
                      <TableCell align="left" variant="head">
                        利用終了日時
                      </TableCell>
                      <TableCell align="left" variant="head">
                        備考
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fetchState.resultRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row" align="center">
                          {row.id}
                        </TableCell>
                        <TableCell align="left">
                          {DateUtils.toDisplayFormat(row.startDateTime)}
                        </TableCell>
                        <TableCell align="left">
                          {DateUtils.toDisplayFormat(row.endDateTime)}
                        </TableCell>
                        <TableCell align="left">{row.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              CLOSE
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </Dialog>
  );
}

ReservationStatusDialog.propTypes = {
  openDialog: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    target: PropTypes.object,
  }),
  setOpenDialog: PropTypes.func.isRequired,
};
