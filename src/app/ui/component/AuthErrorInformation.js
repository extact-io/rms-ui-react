import { SessionContext } from 'app/provider/SessionContextProvider';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { Button, makeStyles, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  message: {
    marginTop: theme.spacing(1),
  },
}));

export function AuthErrorInformation({ messageState }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const { logout } = useContext(SessionContext);
  const handleLogout = () => {
    messageState.clear();
    logout();
    navigate('/login');
  };

  return (
    <Snackbar open={messageState.shouldMessageRender()}>
      <Alert
        severity={messageState.severity}
        className={classes.message}
        action={
          <Button variant="outlined" color="inherit" size="small" onClick={handleLogout}>
            Login
          </Button>
        }
      >
        {messageState.message}
      </Alert>
    </Snackbar>
  );
}
