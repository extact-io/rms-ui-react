import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';

export default function ConfirmDialog({ message, open, handleYes, handleNo, focusTarget = '' }) {
  ConfirmDialog.propTypes = {
    message: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    handleYes: PropTypes.func.isRequired,
    handleNo: PropTypes.func.isRequired,
    focusTarget: PropTypes.string,
  };

  let yesVariantType,
    noVariantType = 'text';
  switch (focusTarget.toLowerCase()) {
    case 'yes':
      yesVariantType = 'outlined';
      break;
    case 'no':
      noVariantType = 'outlined';
      break;
  }

  return (
    <Dialog open={open} onClose={handleNo}>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button
          onClick={handleNo}
          variant={noVariantType}
          color="primary"
          autoFocus={focusTarget.toLowerCase() === 'no'}
        >
          No
        </Button>
        <Button
          onClick={handleYes}
          variant={yesVariantType}
          color="primary"
          autoFocus={focusTarget.toLowerCase() === 'yes'}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
