import { DetailDialogButton, EditDialogButton } from 'core/mastermainte/MasterMainteDialogButton';

export const COMMON_GRID_COLUMNS = [
  {
    field: 'detailbtn',
    headerName: '-',
    headerAlign: 'center',
    width: 80,
    editable: false,
    sortable: false,
    renderCell: function renderCell(params) {
      return <EditDialogButton targetId={params.row.id} />;
    },
  },
  {
    field: 'id',
    headerName: 'ID',
    headerAlign: 'center',
    align: 'center',
    width: 80,
    editable: false,
    renderCell: function renderCell(params) {
      return <DetailDialogButton targetId={params.row.id} />;
    },
  },
];
