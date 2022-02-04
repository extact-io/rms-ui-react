import ConfirmDialog from 'core/component/ConfirmDialog';
import { ValidatableField } from 'core/field/ValidatableField';
import {
  DialogModelContext,
  DialogPageContext,
} from 'core/mastermainte/MasterMainteDialogContextProvider';
import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  Divider,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export default function MasterMainteDialog({ dialogContent }) {
  const classes = useStyles();

  const dialogModel = useContext(DialogModelContext);
  const pageContext = useContext(DialogPageContext);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const DialogContent = dialogModel.getDialogContent(dialogContent);

  const handleChangeTarge = (event) => {
    dialogModel.input(event.target.name, event.target.value);
  };
  const handleClose = (event, reason) => {
    if (dialogModel.loading) {
      return; // ignore
    }
    if (!pageContext.ignoreBackdropClick || reason === 'escapeKeyDown') {
      pageContext.setOpenDialog(false);
      pageContext.reset();
    }
  };
  const handleDetailOK = () => {
    pageContext.setOpenDialog(false);
    pageContext.reset();
  };
  const handleAddCancel = () => {
    pageContext.setOpenDialog(false);
    pageContext.reset();
  };
  const handleAddReflect = async () => {
    if (!(await dialogModel.addTarget())) {
      return;
    }
    pageContext.setOpenDialog(false);
    pageContext.reset();
  };
  const handleEditMode = () => {
    pageContext.changeMode('edit');
  };
  const handleEditCancel = () => {
    if (pageContext.isDetailPageBack()) {
      dialogModel.restoreTarget();
      pageContext.changeMode('detail');
      return;
    }
    pageContext.setOpenDialog(false);
    pageContext.reset();
  };
  const handleEditReflect = async () => {
    if (!(await dialogModel.updateTarget())) {
      return;
    }
    if (pageContext.isDetailPageBack()) {
      pageContext.changeMode('detail');
      return;
    }
    pageContext.setOpenDialog(false);
    pageContext.reset();
  };
  const handleDelete = () => {
    setOpenConfirmDialog(true);
  };
  const handleDeleteConfirmingYes = async () => {
    dialogModel.deleteTarget(pageContext);
    setOpenConfirmDialog(false);
  };
  const handleDeleteConfirmingNo = () => {
    setOpenConfirmDialog(false);
  };

  return (
    <React.Fragment>
      <Dialog open={pageContext.openDialog} onClose={handleClose}>
        {pageContext.openDialog && (
          <React.Fragment>
            <DialogContent
              dialogModel={dialogModel}
              pageContext={pageContext}
              handleChangeTarge={handleChangeTarge}
            />
            <div className={classes.divider}>
              {dialogModel.loading && <LinearProgress color="primary" />}
              {!dialogModel.loading && <Divider />}
            </div>
            {pageContext.isEdit() && (
              <DialogActions classes={{ root: classes.buttons }}>
                <Box>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleDelete}
                    disabled={dialogModel.loading}
                  >
                    削除する
                  </Button>
                  <ConfirmDialog
                    message={`番号${dialogModel.target.id}を削除しますか？`}
                    open={openConfirmDialog}
                    handleYes={handleDeleteConfirmingYes}
                    handleNo={handleDeleteConfirmingNo}
                    focusTarget="no"
                  />
                </Box>
                <Box>
                  <Button
                    className={classes.button}
                    onClick={handleEditCancel}
                    disabled={dialogModel.loading}
                  >
                    CANCEL
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    disabled={!ValidatableField.allOk(dialogModel.target) || dialogModel.loading}
                    onClick={handleEditReflect}
                  >
                    更新する
                  </Button>
                </Box>
              </DialogActions>
            )}
            {pageContext.isDetail() && (
              <DialogActions classes={{ root: classes.buttons }}>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={handleDetailOK}
                >
                  OK
                </Button>
                {!pageContext.isReferenceOnly() && (
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleEditMode}
                  >
                    編集へ
                  </Button>
                )}
              </DialogActions>
            )}
            {pageContext.isAdd() && (
              <DialogActions>
                <Button
                  className={classes.button}
                  onClick={handleAddCancel}
                  disabled={dialogModel.loading}
                >
                  CANCEL
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  disabled={!ValidatableField.allOk(dialogModel.target) || dialogModel.loading}
                  onClick={handleAddReflect}
                >
                  登録
                </Button>
              </DialogActions>
            )}
          </React.Fragment>
        )}
      </Dialog>
    </React.Fragment>
  );
}
