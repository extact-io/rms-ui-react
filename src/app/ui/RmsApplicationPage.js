import { ConfigConsts } from 'app/ConfigConsts';
import { RmsApplicationContextProvider } from 'app/provider/RmsApplicationContextProvider';
import { TabContext } from 'app/provider/TabContextProvider';
import TopMenu from 'app/ui/menu/TopMenu';
import UserMenu from 'app/ui/menu/UserMenu';
import Copyright from 'core/component/Copyright';
import React, { useContext } from 'react';
import { Outlet } from 'react-router';
import { AppBar, Box, makeStyles, Tab, Tabs, Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: (props) => ({
    backgroundColor: props.appBarColor,
  }),
  tabs: {
    flexGrow: 1,
  },
  tab: {
    fontSize: '1rem',
  },
}));

function RmsApplication({ appConfig }) {
  const classes = useStyles({ appBarColor: appConfig.topMenu.appBarColor });
  const { currentPanelId, switchTab } = useContext(TabContext);
  const handleSwitchTab = (event, newValue) => {
    switchTab(newValue, null);
  };
  return (
    <div className={classes.root}>
      {/* メニューバー表示 */}
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <TopMenu switchTab={switchTab} />
          <Tabs
            value={
              currentPanelId === appConfig.topMenu.panelId ||
              currentPanelId === ConfigConsts.COMMON.PANEL_ID.USER_PROFILE
                ? false
                : currentPanelId
            }
            onChange={handleSwitchTab}
            className={classes.tabs}
          >
            {appConfig.panels.map((value, index) => (
              <Tab
                id={`rms-tab-${index}`}
                key={index + 1}
                label={value.label}
                value={value.panelId}
                className={classes.tab}
              />
            ))}
          </Tabs>
          <UserMenu switchTab={switchTab} />
        </Toolbar>
      </AppBar>
      {/* パネル表示 from Router */}
      <Outlet />
      {/* // フッタ表示 */}
      <Box mt={5}>
        <Copyright />
      </Box>
    </div>
  );
}

export function RmsApplicationPage({ appConfig }) {
  return (
    <RmsApplicationContextProvider appConfig={appConfig}>
      <RmsApplication appConfig={appConfig} />
    </RmsApplicationContextProvider>
  );
}
