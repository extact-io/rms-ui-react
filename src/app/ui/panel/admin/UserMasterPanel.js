import PanelLayout from 'app/ui/panel/PanelLayout';
import { userMasterContext } from 'app/ui/panel/admin/UserMasterContext';
import MasterMainteDataGrid from 'core/mastermainte/MasterMainteDataGrid';

export default function UserMasterPanel() {
  return (
    <PanelLayout width={userMasterContext.layout.width}>
      <MasterMainteDataGrid masterContext={userMasterContext} />
    </PanelLayout>
  );
}
