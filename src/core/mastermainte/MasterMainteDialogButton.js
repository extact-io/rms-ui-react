import { useOverflownTooltip } from 'core/component/TooltipedText';
import {
  DialogModelContext,
  DialogPageContext,
} from 'core/mastermainte/MasterMainteDialogContextProvider';
import { useContext } from 'react';
import { Button, Link, makeStyles, Tooltip } from '@material-ui/core';

export function EditDialogButton({ targetId }) {
  const dialogModel = useContext(DialogModelContext);
  const pageContext = useContext(DialogPageContext);

  const handleOpenDialog = () => {
    dialogModel.begin(targetId);
    pageContext.setOpenDialog(true);
    pageContext.changeMode('edit');
  };

  return (
    <Button variant="outlined" size="small" color="primary" onClick={handleOpenDialog}>
      編集
    </Button>
  );
}

export function DetailDialogButton({ targetId }) {
  const dialogModel = useContext(DialogModelContext);
  const pageContext = useContext(DialogPageContext);

  const handleOpenDialog = (event) => {
    event.preventDefault();
    dialogModel.begin(targetId);
    pageContext.setOpenDialog(true);
    pageContext.changeMode('detail');
  };

  return (
    <Button
      component={Link}
      underline="always"
      size="large"
      color="primary"
      onClick={handleOpenDialog}
    >
      {targetId}
    </Button>
  );
}

export function AddDialogButton() {
  const dialogModel = useContext(DialogModelContext);
  const pageContext = useContext(DialogPageContext);

  const handleOpenDialog = () => {
    dialogModel.begin();
    pageContext.setOpenDialog(true);
    pageContext.changeMode('add');
  };

  return (
    <Button variant="contained" size="small" color="primary" onClick={handleOpenDialog}>
      追加
    </Button>
  );
}

const useStyles = makeStyles(() => ({
  link: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export function ReferenceDialogButton({ title, targetRow, targetClass, dialogContent }) {
  const classes = useStyles();
  const dialogModel = useContext(DialogModelContext);
  const pageContext = useContext(DialogPageContext);

  const [tooltip, textRef] = useOverflownTooltip(title);

  const handleOpenDialog = (event) => {
    event.preventDefault();
    dialogModel.beginForReference(targetRow, targetClass, dialogContent);
    pageContext.setOpenDialog(true);
    pageContext.changeMode('detail', true); // refererenceOnly -> true
  };

  return (
    <Tooltip title={tooltip}>
      <Link
        ref={textRef}
        href="#"
        underline="always"
        color="primary"
        onClick={handleOpenDialog}
        className={classes.link}
      >
        {title}
      </Link>
    </Tooltip>
  );
}
