import { ConfigConsts } from 'app/ConfigConsts';
import { createTheme } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';

const PANEL_ID = ConfigConsts.MEMBER.PANEL_ID;

export const AppConfig = {
  them: createTheme({
    palette: {
      primary: indigo,
    },
  }),
  topMenu: {
    panelId: PANEL_ID.TOP,
    appBarColor: indigo[500],
  },
  panels: [
    {
      panelId: PANEL_ID.INQ_RENTAL_ITEM,
      label: 'レンタル品を探す',
      desc: '用意されているレンタル品を検索し結果から利用状況の確認や予約も行うことができます',
    },
    {
      panelId: PANEL_ID.ENT_RESERVATION_FLOW,
      label: 'レンタル品を予約する',
      desc: '予約したいレンタル品を選択しレンタル日を指定した予約ができます',
    },
    {
      panelId: PANEL_ID.INQ_RESERVATION,
      label: '予約を確認する',
      desc: '予約一覧から予約の詳細を確認したり自分の予約であればキャンセルもできます',
    },
  ],
};
