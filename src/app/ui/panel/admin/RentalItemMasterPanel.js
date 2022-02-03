import PanelLayout from 'app/ui/panel/PanelLayout';
import { rentalItemMasterContext } from 'app/ui/panel/admin/RentalItemMasterContext';
import MasterMainteDataGrid from 'core/mastermainte/MasterMainteDataGrid';

export default function RentalItemMasterPanel() {
  return (
    <PanelLayout width={rentalItemMasterContext.layout.width}>
      <MasterMainteDataGrid masterContext={rentalItemMasterContext} />
    </PanelLayout>
  );
}
