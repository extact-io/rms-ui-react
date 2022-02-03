import { ConfigConsts } from 'app/ConfigConsts';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { TabContext } from 'app/provider/TabContextProvider';
import { FetchInformation } from 'app/ui/component/FetchInformation';
import ReservationStatusDialog from 'app/ui/component/ReservationStatusDialog';
import PanelLayout from 'app/ui/panel/PanelLayout';
import useFromToDateTime from 'app/ui/panel/member/useFromToDateTime';
import {
  FtdKeyboardDatePicker,
  FtdKeyboardTimePicker,
  JapaneseDateFnsUtils,
} from 'core/component/FtdKeyboardDateTimePickers';
import SortableTableHeaderCell, { useSortOrder } from 'core/component/SortableTableHeaderCell';
import { useFetchState } from 'core/hook/useFetchState';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import jaLocale from 'date-fns/locale/ja';
import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  hover: {
    '& tbody>.MuiTableRow-root:hover': {
      background: theme.palette.grey[50],
    },
  },
  head: {
    background: theme.palette.grey[200],
  },
  input: {
    margin: '4px',
  },
  switchCell: {
    padding: theme.spacing(1),
  },
  reserveButton: {
    marginLeft: theme.spacing(1),
  },
}));

const memberApiFacade = ApiClientFactory.instance.getMemberApiFacade();
const fetchFinders = {
  all: memberApiFacade.findAllRentalItems,
  now: memberApiFacade.findCanRentedItemAtNow,
  term: memberApiFacade.findCanRentedItemAtTerm,
};

export default function RentalItemListPanel() {
  const classes = useStyles();

  const { messageState } = useContext(GlobalContext);
  const { switchTab } = useContext(TabContext);
  const fetchState = useFetchState(messageState);

  const fromToDateTime = useFromToDateTime();
  const [findMethod, setFindMethod] = useState('all');

  const [order, orderProperty, changeOrder, sortByOrder] = useSortOrder('id');
  const [dense, setDense] = useState(false);
  const [openDialog, setOpenDialog] = useState({ open: false });

  const handleChangeFindMethod = (event) => {
    setFindMethod(event.target.value);
  };
  const handleChangeDateTime = (date, propName) => {
    fromToDateTime.changeDateTime(date, propName);
    setFindMethod('term');
  };
  const handleRerender = () => {
    executeFetchRows();
  };
  const handleToEntryFlow = (row) => {
    switchTab(ConfigConsts.MEMBER.PANEL_ID.ENT_RESERVATION_FLOW, row);
  };
  const handleOpenDialog = (event, targetItem) => {
    setOpenDialog({ open: true, target: targetItem });
  };

  const enableRerenderButton = () => {
    return findMethod !== 'term' || fromToDateTime.allOk();
  };
  const executeFetchRows = () => {
    if (findMethod === 'term' && !fromToDateTime.checkStartDateTimePastNow()) {
      return;
    }
    const fetchFinder = fetchFinders[findMethod];
    const from = fromToDateTime.getStartDateTime();
    const to = fromToDateTime.getEndDateTime();
    fetchState.invokeFetch(() => fetchFinder(from, to));
  };

  useEffect(() => {
    executeFetchRows();
    return () => messageState.clear();
  }, []);

  return (
    <React.Fragment>
      <PanelLayout width={730}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" id="title" component="div">
              レンタル品検索
            </Typography>
          </Grid>
          <Grid container item>
            <Grid item xs={12}>
              <RadioGroup
                row
                name="findMethod"
                value={findMethod}
                onChange={handleChangeFindMethod}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio color="primary" />}
                  label="すべてのレンタル品を表示"
                />
                <FormControlLabel
                  value="now"
                  control={<Radio color="primary" />}
                  label="今予約可能なものだけを表示"
                />
                <FormControlLabel
                  value="term"
                  control={<Radio color="primary" />}
                  label="指定した期間で予約可能なものだけを表示"
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={JapaneseDateFnsUtils} locale={jaLocale}>
                <FtdKeyboardDatePicker
                  id="startDate"
                  label="開始日"
                  disablePast
                  disableToolbar
                  variant="inline"
                  margin="dense"
                  inputVariant="outlined"
                  format="yyyy/MM/dd"
                  fromToDateTime={fromToDateTime}
                  onChange={(date) => handleChangeDateTime(date, 'startDate')}
                  className={classes.input}
                  style={{ width: '170px' }}
                />
                <FtdKeyboardTimePicker
                  id="startTime"
                  label="開始時刻"
                  disableToolbar
                  variant="inline"
                  margin="dense"
                  inputVariant="outlined"
                  ampm={false}
                  fromToDateTime={fromToDateTime}
                  onChange={(date) => handleChangeDateTime(date, 'startTime')}
                  className={classes.input}
                  style={{ width: '125px' }}
                />
                <Typography display="inline">&nbsp;～&nbsp;</Typography>
                <FtdKeyboardDatePicker
                  id="endDate"
                  label="終了日"
                  disablePast
                  disableToolbar
                  variant="inline"
                  margin="dense"
                  inputVariant="outlined"
                  format="yyyy/MM/dd"
                  minDate={fromToDateTime.startDate.value}
                  fromToDateTime={fromToDateTime}
                  onChange={(date) => handleChangeDateTime(date, 'endDate')}
                  className={classes.input}
                  style={{ width: '170px' }}
                />
                <FtdKeyboardTimePicker
                  id="endTime"
                  label="終了時刻"
                  disableToolbar
                  variant="inline"
                  margin="dense"
                  inputVariant="outlined"
                  ampm={false}
                  fromToDateTime={fromToDateTime}
                  onChange={(date) => handleChangeDateTime(date, 'endTime')}
                  className={classes.input}
                  style={{ width: '125px' }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleRerender}
              disabled={!enableRerenderButton() || fetchState.loading}
            >
              再表示
            </Button>
          </Grid>
          <FetchInformation fetchState={fetchState} />
          {fetchState.shouldRenerRows() && (
            <React.Fragment>
              <Grid item xs={12}>
                <div className={classes.hover}>
                  <TableContainer>
                    <Table size={dense ? 'small' : 'medium'}>
                      <TableHead className={classes.head}>
                        <TableRow>
                          <SortableTableHeaderCell
                            align="center"
                            variant="head"
                            property="id"
                            order={order}
                            orderProperty={orderProperty}
                            handleSortOrder={changeOrder}
                            className={classes.idCell}
                          >
                            ID
                          </SortableTableHeaderCell>
                          <SortableTableHeaderCell
                            align="left"
                            variant="head"
                            property="itemName"
                            order={order}
                            orderProperty={orderProperty}
                            handleSortOrder={changeOrder}
                            style={{ width: '260px' }}
                          >
                            レンタル品名
                          </SortableTableHeaderCell>
                          <SortableTableHeaderCell
                            align="left"
                            variant="head"
                            property="serialNo"
                            order={order}
                            orderProperty={orderProperty}
                            handleSortOrder={changeOrder}
                            style={{ width: '160px' }}
                          >
                            シリアル番号
                          </SortableTableHeaderCell>
                          <TableCell className={classes.switchCell} style={{ width: '190px' }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={dense}
                                  color="primary"
                                  onChange={() => setDense(!dense)}
                                />
                              }
                              label={<Typography variant="body2">行間コンパクト</Typography>}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortByOrder(fetchState.resultRows).map((row) => (
                          <TableRow hover key={row.id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                              className={classes.idCell}
                            >
                              {row.id}
                            </TableCell>
                            <TableCell align="left">{row.itemName}</TableCell>
                            <TableCell align="left">{row.serialNo}</TableCell>
                            <TableCell align="left">
                              <Button
                                type="submit"
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={(event) => handleOpenDialog(event, row)}
                              >
                                予約状況
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                size="small"
                                color="primary"
                                className={classes.reserveButton}
                                onClick={() => handleToEntryFlow(row)}
                              >
                                予約する
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <ReservationStatusDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      </PanelLayout>
    </React.Fragment>
  );
}
