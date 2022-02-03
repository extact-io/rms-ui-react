import { makeStyles } from '@material-ui/core/styles';

const useCommonStepStyles = makeStyles((theme) => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  back: {
    fontSize: '1rem',
  },
}));
export { useCommonStepStyles };
