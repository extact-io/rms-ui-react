import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { SessionContext } from 'app/provider/SessionContextProvider';
import { FetchInformation } from 'app/ui/component/FetchInformation';
import PanelLayout from 'app/ui/panel/PanelLayout';
import ConfirmDialog from 'core/component/ConfirmDialog';
import { useFetchState } from 'core/hook/useFetchState';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import { DateUtils } from 'core/utils/DateUtils';
import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[100],
  },
}));

export default function ReserveComfirmationPanel() {
  const classes = useStyles();

  const { backdropState, messageState } = useContext(GlobalContext);
  const { loginUser } = useContext(SessionContext);
  const fetchState = useFetchState(messageState);

  const [open, setOpen] = useState(false);
  const [focusedId, setFocusedId] = useState();
  const handleCancelReservation = (id) => {
    setFocusedId(id);
    setOpen(true);
  };
  const handleConfirmingYes = async () => {
    setOpen(false);
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    backdropState.start();
    try {
      await memberApiFacade.cancelReservation(focusedId);
      fetchState.removeRow(focusedId);
    } catch (error) {
      messageState.pushMessage(error.code, error.message);
    } finally {
      backdropState.end();
    }
  };
  const handleConfirmingNo = () => {
    setOpen(false);
  };

  useEffect(() => {
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    fetchState.invokeFetch(() => memberApiFacade.findReservationByReserverId(loginUser.id));
    return () => messageState.clear();
  }, []);

  return (
    <React.Fragment>
      <PanelLayout width={820}>
        <Box px={1} pb={3} align="left">
          <Typography variant="h6" id="tableTitle" component="div">
            ????????????
          </Typography>
        </Box>
        <FetchInformation fetchState={fetchState} />
        {fetchState.shouldRenerRows() && (
          <React.Fragment>
            <TableContainer>
              <Table>
                <TableHead className={classes.head}>
                  <TableRow>
                    <TableCell align="center" variant="head">
                      No
                    </TableCell>
                    <TableCell align="left" variant="head">
                      ??????????????????
                    </TableCell>
                    <TableCell align="left" variant="head">
                      ??????????????????
                    </TableCell>
                    <TableCell align="left" variant="head">
                      ??????????????????
                    </TableCell>
                    <TableCell align="left" variant="head">
                      ??????
                    </TableCell>
                    <TableCell></TableCell>
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
                      <TableCell align="left">{row.rentalItemDto.itemName}</TableCell>
                      <TableCell align="left">{row.note}</TableCell>
                      <TableCell align="left">
                        <Button
                          type="submit"
                          variant="text"
                          color="secondary"
                          onClick={() => handleCancelReservation(row.id)}
                        >
                          cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <ConfirmDialog
              message={`????????????${focusedId}????????????????????????`}
              open={open}
              handleYes={handleConfirmingYes}
              handleNo={handleConfirmingNo}
              focusTarget="no"
            />
          </React.Fragment>
        )}
      </PanelLayout>
    </React.Fragment>
  );
}
