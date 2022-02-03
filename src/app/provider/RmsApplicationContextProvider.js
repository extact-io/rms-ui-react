import { TabContextProvider } from 'app/provider/TabContextProvider';
import { GlobalContextProvider } from 'core/provider/GlobalContextProvider';
import { createContext } from 'react';
import { ThemeProvider } from '@material-ui/core';

export const RmsApplicationContext = createContext();

export function RmsApplicationContextProvider({ appConfig, children }) {
  return (
    <ThemeProvider theme={appConfig.them}>
      <GlobalContextProvider>
        <RmsApplicationContext.Provider value={appConfig}>
          <TabContextProvider topMenu={appConfig.topMenu.panelId}>
            {children}
          </TabContextProvider>
        </RmsApplicationContext.Provider>
      </GlobalContextProvider>
    </ThemeProvider>
  );
}
