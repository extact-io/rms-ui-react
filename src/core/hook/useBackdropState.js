import { useState } from 'react';

export function useBackdropState() {
  const [open, setOpen] = useState(false);
  const start = () => {
    setOpen(true);
  };
  const end = () => {
    setOpen(false);
  };
  return {
    open,
    start,
    end,
  };
}
