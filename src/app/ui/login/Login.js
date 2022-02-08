import { ConfigConsts } from 'app/ConfigConsts';
import { BearerToken } from 'app/model/BearerToken';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { UserType } from 'app/model/field/UserType';
import { SessionContext } from 'app/provider/SessionContextProvider';
import { CenterCircularProgress } from 'core/component/CenterCircularProgress';
import Copyright from 'core/component/Copyright';
import { useMessageState } from 'core/hook/useMessageState';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

export default function Login() {
  const classes = useStyles();

  const [loginPhrase, setLoginPhrase] = useState({
    loginId: 'member1',
    // loginId: 'soramame',
    password: 'member1',
  });
  const navigate = useNavigate();
  const { updateLoginUser, fallbackAuth } = useContext(SessionContext);
  const messageState = useMessageState();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const handleLoginPhraseChange = (event) => {
    setLoginPhrase({ ...loginPhrase, [event.target.name]: event.target.value });
  };

  const handleClickLogin = async (event) => {
    event.preventDefault();
    messageState.clear();
    if (!loginPhrase.loginId || !loginPhrase.password) {
      messageState.pushMessage(ConfigConsts.RMS_ERROR_CODE.AUTH_ERROR, 'IDまたはパスワードの入力がありません');
      return;
    }
    await processLogin(loginPhrase.loginId, loginPhrase.password);
  };

  const processLogin = async (loginId, password) => {
    let loginUser, bearerToken;
    try {
      setLoading(true);
      const authApiFacade = ApiClientFactory.instance.getAuthenticateApiFacade();
      const result = await authApiFacade.authenticate(loginId, password);
      loginUser = result.loginUser;
      bearerToken = result.bearerToken;
    } catch (error) {
      messageState.pushMessage(error.code, error.message);
      return;
    } finally {
      setLoading(false);
    }

    if (!bearerToken) {
      throw new Error('Could not get token.');
    }

    // update session.
    updateLoginUser(loginUser);

    // store token
    const tokenInstance = new BearerToken(loginUser.id, bearerToken);
    tokenInstance.store();

    // transition by role
    switch (loginUser.userType.value) {
      case UserType.USER_TYPES.MEMBER.value:
        navigate('/member');
        break;
      case UserType.USER_TYPES.ADMIN.value:
        navigate('/admin');
        break;
      default:
        throw new Error('Unknown userType=' + loginUser.userType);
    }
  };

  useEffect(async () => {
    const nextPage = await fallbackAuth();
    if (!nextPage) {
      setInitializing(false);
      return;
    }
    navigate(nextPage);
    setInitializing(false);
  }, []);

  if (initializing) {
    return <CenterCircularProgress message='Loading...please wait' />;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          {messageState.shouldMessageRender() && (
            <Alert severity="error" className={classes.alert}>
              {messageState.message}
            </Alert>
          )}
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Rental Management System
          </Typography>
          <form className={classes.form} noValidate>
            {loading && <LinearProgress color="primary" />}
            <TextField
              id="loginId"
              name="loginId"
              label="ID"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              value={loginPhrase.loginId}
              onChange={handleLoginPhraseChange}
              autoComplete="loginId"
              disabled={loading}
            />
            <TextField
              id="password"
              name="password"
              label="Password"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              type="password"
              value={loginPhrase.password}
              onChange={handleLoginPhraseChange}
              autoComplete="current-password"
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleClickLogin}
              disabled={loading}
              autoFocus
            >
              Sign In
            </Button>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </React.Fragment>
  );
}
