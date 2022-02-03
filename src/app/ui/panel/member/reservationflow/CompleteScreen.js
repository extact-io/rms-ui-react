import { TabContext } from 'app/provider/TabContextProvider';
import { GlobalContext } from 'core/provider/GlobalContextProvider';
import React, { useContext, useEffect } from 'react';
import { Link, Typography } from '@material-ui/core';

export default function CompleteScreen({ reservation }) {
  const { messageState } = useContext(GlobalContext);
  const { switchTab, topPanelId } = useContext(TabContext);
  useEffect(() => {
    return () => messageState.clear();
  }, []);
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom>
        ご予約ありがとうございます。
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        ご予約番号は #{reservation.id} です。ご予約内容は予約確認メニューから確認いただけます。
      </Typography>
      <Link href="#" variant="subtitle1" underline="always" onClick={() => switchTab(topPanelId)}>
        TOPへ
      </Link>
    </React.Fragment>
  );
}
