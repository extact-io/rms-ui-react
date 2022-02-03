import { User } from 'app/model/User';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { UserMasterDialogContent } from 'app/ui/panel/admin/UserMasterDialogContent';
import { COMMON_GRID_COLUMNS } from 'core/mastermainte/CommonGridColumns';
import { tooltipedTextCellRender } from 'core/mastermainte/DataGridUtils';

const columns = (showAllColumns) => {
  return [
    ...COMMON_GRID_COLUMNS,
    {
      field: 'loginId',
      headerName: 'ログインID',
      width: 126,
      editable: false,
      renderCell: tooltipedTextCellRender,
    },
    {
      field: 'password',
      headerName: 'パスワード',
      width: 130,
      editable: false,
      renderCell: tooltipedTextCellRender,
      hide: !showAllColumns,
    },
    {
      field: 'userName',
      headerName: 'ユーザ名',
      width: 160,
      editable: false,
      renderCell: tooltipedTextCellRender,
    },
    {
      field: 'userType',
      headerName: '権限',
      width: 85,
      editable: false,
      valueFormatter: (params) => {
        return params.value.label;
      },
      sortComparator: (v1, v2) => {
        return v1.value > v2.value ? 1 : -1;
      },
    },
    {
      field: 'contact',
      headerName: '連絡先',
      width: 240,
      editable: false,
      renderCell: tooltipedTextCellRender,
    },
    {
      field: 'phoneNumber',
      headerName: '電話番号',
      width: 120,
      editable: false,
      hide: !showAllColumns,
      renderCell: tooltipedTextCellRender,
    },
  ];
};

const adminApiFacade = ApiClientFactory.instance.getAdminApiFacade();
export const userMasterContext = {
  title: 'ユーザ管理',
  dlFilename: 'users',
  dialogContent: UserMasterDialogContent,
  columns,
  entityClass: User,
  layout: {
    width: 850,
  },
  serverApi: {
    getAll: adminApiFacade.findAllUserAccounts,
    add: adminApiFacade.addUserAccount,
    update: adminApiFacade.updateUserAccount,
    delete: adminApiFacade.deleteUserAccount,
  },
};
