import PanelLayout from 'app/ui/panel/PanelLayout';
import { reservationMasterContext } from 'app/ui/panel/admin/ReservationMasterContext';
import MasterMainteDataGrid from 'core/mastermainte/MasterMainteDataGrid';

export default function ReservationMasterPanel() {
  return (
    <PanelLayout width={reservationMasterContext.layout.width}>
      <MasterMainteDataGrid masterContext={reservationMasterContext} />
    </PanelLayout>
  );
}
