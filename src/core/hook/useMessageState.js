import { useState } from 'react';

export function useMessageState() {
  const [messageState, setMessageState] = useState({
    open: false,
  });
  const pushMessage = (code, message, severity = 'error') => {
    setMessageState({ open: true, code, message, severity });
  };
  const clear = () => {
    setMessageState({ open: false });
  };
  const shouldMessageRender = () => {
    return messageState.open;
  };
  return {
    ...messageState,
    pushMessage,
    shouldMessageRender,
    clear,
  };
}
