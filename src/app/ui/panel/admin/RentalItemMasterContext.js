import { RentalItem } from 'app/model/RentalItem';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { RentalItemMasterDialogContent } from 'app/ui/panel/admin/RentalItemMasterDialogContent';
import { COMMON_GRID_COLUMNS } from 'core/mastermainte/CommonGridColumns';
import { tooltipedTextCellRender } from 'core/mastermainte/DataGridUtils';

const columns = () => {
  return [
    ...COMMON_GRID_COLUMNS,
    {
      field: 'serialNo',
      headerName: 'シリアル番号',
      width: 160,
      editable: false,
      renderCell: tooltipedTextCellRender,
    },
    {
      field: 'itemName',
      headerName: 'レンタル品名',
      width: 300,
      editable: false,
      renderCell: tooltipedTextCellRender,
    },
  ];
};

const adminApiFacade = ApiClientFactory.instance.getAdminApiFacade();
export const rentalItemMasterContext = {
  title: 'レンタル品管理',
  dlFilename: 'rentalItem',
  dialogContent: RentalItemMasterDialogContent,
  columns,
  entityClass: RentalItem,
  disableShowAllColumnsSwitch: true,
  layout: {
    width: 700,
  },
  serverApi: {
    getAll: adminApiFacade.findAllRentalItems,
    add: adminApiFacade.addRentalItem,
    update: adminApiFacade.updateRentalItem,
    delete: adminApiFacade.deleteRentalItem,
  },
};
