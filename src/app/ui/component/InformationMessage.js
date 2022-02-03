import { ConfigConsts } from 'app/ConfigConsts';
import { AuthErrorInformation } from 'app/ui/component/AuthErrorInformation';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  message: {
    marginTop: theme.spacing(1),
  },
}));

function getSpecificInformation(messageState) {
  switch (messageState?.code) {
    case ConfigConsts.RMS_ERROR_CODE.AUTH_ERROR:
      return <AuthErrorInformation messageState={messageState} />;
    default:
      return null;
  }
}

export function InformationMessage({ messageState }) {
  const classes = useStyles();
  if (!messageState) {
    return <React.Fragment />;
  }
  const specificInformation = getSpecificInformation(messageState);
  if (specificInformation) {
    return <React.Fragment>{specificInformation}</React.Fragment>;
  }
  return (
    <div>
      <Snackbar
        open={messageState.shouldMessageRender()}
        autoHideDuration={6000}
        onClose={messageState.clear}
      >
        <Alert
          severity={messageState.severity}
          className={classes.message}
          onClose={messageState.clear}
        >
          {messageState.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
