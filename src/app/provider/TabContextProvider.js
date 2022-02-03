import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router';

function useCurrentPanel(id) {
  const navigate = useNavigate();
  const [panelId, setPanelId] = useState(id);
  const [keepValue, setKeepValue] = useState(); // パネル間引継データ
  const setCurrentPanel = function (id, ...args) {
    setPanelId(id);
    if (args.length != 0) {
      setKeepValue(args[0]);
    }
    navigate(id); // 遷移の実行
  };
  return [panelId, keepValue, setCurrentPanel];
}

export const TabContext = createContext();

export function TabContextProvider({ topMenu, children }) {
  const [currentPanelId, keepValue, switchTab] = useCurrentPanel(topMenu);
  return (
    <TabContext.Provider
      value={{
        currentPanelId,
        keepValue,
        switchTab,
        topPanelId: topMenu,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}
