import { useBackdropState } from 'core/hook/useBackdropState';
import { useMessageState } from 'core/hook/useMessageState';
import { createContext } from 'react';

export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  const backdropState = useBackdropState();
  const messageState = useMessageState();
  return (
    <GlobalContext.Provider value={{ backdropState, messageState }}>
      {children}
    </GlobalContext.Provider>
  );
}
