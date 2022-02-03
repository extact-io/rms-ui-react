import { InformationMessage } from 'app/ui/component/InformationMessage';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import React, { useContext } from 'react';
import { Backdrop, CircularProgress, CssBaseline, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  layout: (props) => ({
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(props.width + theme.spacing(2) * 2)]: {
      width: props.width,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  }),
  paper: (props) => ({
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(props.width + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  }),
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function PanelLayout({ children, width = 600 }) {
  const classes = useStyles({ width: width });
  const { backdropState, messageState } = useContext(GlobalContext);
  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Backdrop className={classes.backdrop} open={backdropState.open}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <InformationMessage messageState={messageState} />
        <Paper className={classes.paper}>{children}</Paper>
      </main>
    </React.Fragment>
  );
}
