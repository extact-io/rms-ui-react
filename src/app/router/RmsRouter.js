import { SessionContext } from 'app/provider/SessionContextProvider';
import { RmsApplicationPage } from 'app/ui/RmsApplicationPage';
import Login from 'app/ui/login/Login';
import Logout from 'app/ui/login/Logout';
import { AppConfig as adminAppConfig } from 'app/ui/panel/admin/AdminAppConfig';
import RentalItemMasterPanel from 'app/ui/panel/admin/RentalItemMasterPanel';
import ReservationMasterPanel from 'app/ui/panel/admin/ReservationMasterPanel';
import UserMasterPanel from 'app/ui/panel/admin/UserMasterPanel';
import TopPanel from 'app/ui/panel/common/TopPanel';
import UserProfilePanel from 'app/ui/panel/common/UserProfilePanel';
import { AppConfig as memberAppConfig } from 'app/ui/panel/member/MemberAppConfig';
import RentalItemListPanel from 'app/ui/panel/member/RentalItemListPanel';
import ReservationStepPanel from 'app/ui/panel/member/ReservationStepPanel';
import ReserveComfirmationPanel from 'app/ui/panel/member/ReserveComfirmationPanel';
import React, { useContext } from 'react';
import { Navigate } from 'react-router';
import { Route, Routes } from 'react-router-dom';

export function RmsRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="member" element={<RmsApplicationPageAuthWrapper />}>
        <Route index element={<TopPanel panels={memberAppConfig.panels} />} />
        <Route path="item" element={<RentalItemListPanel />} />
        <Route path="reservation" element={<ReservationStepPanel />} />
        <Route path="history" element={<ReserveComfirmationPanel />} />
      </Route>
      <Route path="admin" element={<RmsApplicationPageAuthWrapper />}>
        <Route index element={<TopPanel panels={adminAppConfig.panels} />} />
        <Route path="item" element={<RentalItemMasterPanel />} />
        <Route path="reservation" element={<ReservationMasterPanel />} />
        <Route path="user" element={<UserMasterPanel />} />
      </Route>
      <Route path="user" element={<RmsApplicationPageAuthWrapper />}>
        <Route path="profile" element={<UserProfilePanel />} />
      </Route>
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
}

function RmsApplicationPageAuthWrapper() {
  const { authenticated, loginUser } = useContext(SessionContext);
  if (!authenticated()) {
    return <Navigate to='/login' />;
  }
  const appConfig = loginUser.userType.isMember() ? memberAppConfig : adminAppConfig;
  return <RmsApplicationPage appConfig={appConfig} />;
}
