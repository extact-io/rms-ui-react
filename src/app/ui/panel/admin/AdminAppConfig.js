import { ConfigConsts } from 'app/ConfigConsts';
import { createTheme } from '@material-ui/core';
import { indigo, teal } from '@material-ui/core/colors';

const PANEL_ID = ConfigConsts.ADMIN.PANEL_ID;

export const AppConfig = {
  them: createTheme({
    palette: {
      primary: indigo,
    },
  }),
  topMenu: {
    panelId: PANEL_ID.TOP,
    appBarColor: teal[700],
  },
  panels: [
    {
      panelId: PANEL_ID.ITEM_MAINT,
      label: 'レンタル品管理',
      desc: 'レンタル品の登録や更新などを行うことができます',
    },
    {
      panelId: PANEL_ID.RESERVATION_MAINT,
      label: 'レンタル予約管理',
      desc: '登録されたレンタル予約の削除や変更を行うことができます',
    },
    {
      panelId: PANEL_ID.USER_MAINT,
      label: 'ユーザ管理',
      desc: 'ユーザの登録や更新、削除などを行うことができます',
    },
  ],
};
