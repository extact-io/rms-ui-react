import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { FetchInformation } from 'app/ui/component/FetchInformation';
import { useCommonStepStyles } from 'app/ui/panel/member/reservationflow/useCommonStepStyles';
import { useFetchState } from 'core/hook/useFetchState';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import React, { useContext, useEffect } from 'react';
import {
  Button,
  makeStyles,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  hover: {
    '& tbody>.MuiTableRow-root:hover': {
      background: theme.palette.grey[50],
    },
  },
  head: {
    background: theme.palette.grey[200],
  },
  idCell: {
    paddingLeft: '0px',
  },
}));

export default function SelectItemStep({ stepFlow, reservation }) {
  const classes = { ...useStyles(), ...useCommonStepStyles() };
  const { messageState } = useContext(GlobalContext);
  const fetchState = useFetchState(messageState);

  const handleItemRowClicked = (event, id) => {
    const selectedItem = fetchState.resultRows.find((item) => item.id === id);
    reservation.changeReservation(selectedItem, 'item');
  };

  useEffect(() => {
    const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
    fetchState.invokeFetch(() => memberApiFacade.findAllRentalItems());
    return () => messageState.clear();
  }, []);

  return (
    <React.Fragment>
      <div className={classes.hover}>
        <Typography variant="h6" gutterBottom>
          レンタル品を選択してください
        </Typography>
        <FetchInformation fetchState={fetchState} />
        {fetchState.shouldRenerRows() && (
          <TableContainer className={classes.table}>
            <Table>
              <TableHead className={classes.head}>
                <TableRow>
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell align="center" variant="head" className={classes.idCell}>
                    ID
                  </TableCell>
                  <TableCell align="left" variant="head">
                    レンタル品名
                  </TableCell>
                  <TableCell align="left" variant="head">
                    シリアル番号
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchState.resultRows.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={(event) => handleItemRowClicked(event, row.id)}
                  >
                    <TableCell padding="checkbox">
                      <Radio
                        checked={Boolean(reservation.item) && reservation.item.id == row.id}
                        value={row.id}
                        name="itemId"
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="center" className={classes.idCell}>
                      {row.id}
                    </TableCell>
                    <TableCell align="left">{row.itemName}</TableCell>
                    <TableCell align="left">{row.serialNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
      <div className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => stepFlow.toNextStep()}
          disabled={!reservation.item}
          className={classes.button}
        >
          次へ
        </Button>
      </div>
    </React.Fragment>
  );
}
