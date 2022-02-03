import { TabContext } from 'app/provider/TabContextProvider';
import RmsLog from 'app/ui/menu/RmsLog';
import React, { useContext } from 'react';
import { IconButton } from '@material-ui/core';

export default function TopMenu({ switchTab }) {
  const { topPanelId } = useContext(TabContext);
  const handleToTop = () => {
    switchTab(topPanelId);
  };

  return (
    <React.Fragment>
      <IconButton onClick={handleToTop} color="inherit">
        <RmsLog />
      </IconButton>
    </React.Fragment>
  );
}
