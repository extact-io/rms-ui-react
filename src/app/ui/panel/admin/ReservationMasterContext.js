import { RentalItem } from 'app/model/RentalItem';
import { Reservation } from 'app/model/Reservation';
import { User } from 'app/model/User';
import { ApiClientFactory } from 'app/model/api/ApiClientFactory';
import { RentalItemMasterDialogContent } from 'app/ui/panel/admin/RentalItemMasterDialogContent';
import { ReservationMasterDialogContent } from 'app/ui/panel/admin/ReservationMasterDialogContent';
import { UserMasterDialogContent } from 'app/ui/panel/admin/UserMasterDialogContent';
import { COMMON_GRID_COLUMNS } from 'core/mastermainte/CommonGridColumns';
import { tooltipedTextCellRender } from 'core/mastermainte/DataGridUtils';
import { ReferenceDialogButton } from 'core/mastermainte/MasterMainteDialogButton';
import { DateUtils } from 'core/utils/DateUtils';

const columns = (showAllColumns) => {
  return [
    ...COMMON_GRID_COLUMNS,
    {
      field: 'rentalItemDto',
      headerName: 'レンタル品名',
      width: 200,
      editable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (params) => {
        return (
          <ReferenceDialogButton
            title={params.value.itemName}
            targetRow={params.value}
            targetClass={RentalItem}
            dialogContent={RentalItemMasterDialogContent}
          />
        );
      },
      sortComparator: (v1, v2) => {
        return v1.itemName > v2.itemName ? 1 : -1;
      },
    },
    {
      field: 'startDateTime',
      headerName: '利用開始日時',
      width: 150,
      editable: false,
      valueFormatter: (params) => {
        return DateUtils.toDisplayFormat(params.value);
      },
    },
    {
      field: 'endDateTime',
      headerName: '利用終了日時',
      width: 150,
      editable: false,
      valueFormatter: (params) => {
        return DateUtils.toDisplayFormat(params.value);
      },
    },
    {
      field: 'userAccountDto',
      headerName: '予約者',
      width: 160,
      editable: false,
      // eslint-disable-next-line react/display-name
      renderCell: (params) => {
        return (
          <ReferenceDialogButton
            title={params.value.userName}
            targetRow={params.value}
            targetClass={User}
            dialogContent={UserMasterDialogContent}
          />
        );
      },
      sortComparator: (v1, v2) => {
        return v1.userName > v2.userName ? 1 : -1;
      },
    },
    {
      field: 'note',
      headerName: '備考',
      width: 160,
      editable: false,
      hide: !showAllColumns,
      renderCell: tooltipedTextCellRender,
    },
  ];
};

const adminApiFacade = ApiClientFactory.instance.getAdminApiFacade();
export const reservationMasterContext = {
  title: 'レンタル予約管理',
  dlFilename: 'reservations',
  dialogContent: ReservationMasterDialogContent,
  columns,
  entityClass: Reservation,
  disableAddButton: true,
  layout: {
    width: 890,
  },
  serverApi: {
    getAll: adminApiFacade.findAllReservations,
    add: adminApiFacade.addReservation,
    update: adminApiFacade.updateReservation,
    delete: adminApiFacade.deleteReservation,
  },
};
