import { CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  progress: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
  },
  message: {
    justifyContent: 'center',
    position: 'fixed',
    top: '55%',
  },
}));

export function CenterCircularProgress({ message = '' }) {
  const classes = useStyles();
  return (
    <div className={classes.progress}>
      <CircularProgress />
      <span className={classes.message}>{message}</span>
    </div>
  );
}
