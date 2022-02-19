import MasterMainteDialog from 'core/mastermainte/MasterMainteDialog';
import { AddDialogButton } from 'core/mastermainte/MasterMainteDialogButton';
import { MasterMainteDialogContextProvider } from 'core/mastermainte/MasterMainteDialogContextProvider';
import { rowsReducer } from 'core/mastermainte/rowsReducer';
import { useDialogModel } from 'core/mastermainte/useDialogModel';
import { useDialogPageContext } from 'core/mastermainte/useDialogPageContext';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import React, { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  jaJP,
} from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(0.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  add: {
    paddingLeft: 10,
  },
  addDisable: {
    fontSize: '0.75rem',
  },
}));

function CustomToolbar({ checked, setChecked, masterContext }) {
  const classes = useStyles();
  return (
    <GridToolbarContainer>
      <Grid container className={classes.toolbar}>
        <Grid item className={classes.add}>
          {!masterContext.disableAddButton ? (
            <AddDialogButton />
          ) : (
            <Button variant="contained" className={classes.addDisable} disabled>
              ※追加不可
            </Button>
          )}
        </Grid>
        <Grid item>
          <FormControlLabel
            disabled={masterContext?.disableShowAllColumnsSwitch}
            control={<Switch checked={checked} onChange={() => setChecked(!checked)} />}
            label="全ての項目を表示"
          />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport
            csvOptions={{
              allColumns: true,
              fileName: masterContext.dlFilename,
            }}
          />
        </Grid>
      </Grid>
    </GridToolbarContainer>
  );
}

export default function MasterMainteDataGrid({ masterContext }) {
  const { messageState } = useContext(GlobalContext);
  const [rowsState, dispach] = useReducer(rowsReducer, []);
  const dialogModel = useDialogModel(rowsState, dispach, {
    masterContext,
    messageState,
  });
  const dialogPageContext = useDialogPageContext();

  const [showAllColumns, setShowAllColumns] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [sortModel, setSortModel] = useState([
    {
      field: 'id',
      sort: 'asc',
    },
  ]);

  // returnを返す場合は同期メソッドから返す必要があるので
  // async/awaitでなくPromiseスタイルにしている
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    masterContext.serverApi
      .getAll()
      .then((data) => {
        dispach({ type: 'INIT', initRows: data });
      })
      .catch((error) => {
        messageState.pushMessage(error.code, error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    return () => messageState.clear();
  }, []);

  const columns = useMemo(() => {
    return masterContext.columns(showAllColumns);
  }, [showAllColumns]);

  const height = useMemo(() => {
    const baseSize = showAllColumns ? 440 : 420;
    const upSize = (pageSize - 5) * 52;
    return baseSize + upSize;
  }, [showAllColumns, pageSize]);

  return (
    <React.Fragment>
      <Box px={1} pb={3} align="left">
        <Typography variant="h6" id="tableTitle" component="div">
          {masterContext.title}
        </Typography>
      </Box>
      <MasterMainteDialogContextProvider
        dialogModel={dialogModel}
        dialogPageContext={dialogPageContext}
      >
        <div style={{ height, width: '100%' }}>
          <DataGrid
            localeText={{
              ...jaJP.props.MuiDataGrid.localeText,
              filterOperatorIsEmpty: '...が空である',
              filterOperatorIsNotEmpty: '...が空でない',
            }}
            rows={rowsState}
            columns={columns}
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageSizeChange={(newValue) => setPageSize(newValue)}
            disableSelectionOnClick
            disableColumnMenu
            components={{
              Toolbar: CustomToolbar,
            }}
            componentsProps={{
              toolbar: {
                checked: showAllColumns,
                setChecked: setShowAllColumns,
                masterContext,
              },
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => setSortModel(model)}
            loading={loading}
          />
        </div>
        <MasterMainteDialog dialogContent={masterContext.dialogContent} />
      </MasterMainteDialogContextProvider>
    </React.Fragment>
  );
}
