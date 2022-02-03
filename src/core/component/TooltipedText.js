import { ComponentUtils } from 'core/utils/ComponentUtils';
import { useEffect, useRef, useState } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  text: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

export function useOverflownTooltip(text) {
  const textRef = useRef(null);
  const [tooltip, setTooltip] = useState('');

  useEffect(() => {
    if (textRef && textRef.current) {
      const isOver = ComponentUtils.isTextOverflown(textRef.current);
      if (isOver) {
        setTooltip(text);
      } else {
        setTooltip('');
      }
    }
  }, [text, textRef]);
  return [tooltip, textRef];
}

export function TooltipedText({ text }) {
  const classes = useStyles();
  const [tooltip, textRef] = useOverflownTooltip(text);

  return (
    <Tooltip title={tooltip}>
      <div ref={textRef} className={classes.text}>
        {text}
      </div>
    </Tooltip>
  );
}
