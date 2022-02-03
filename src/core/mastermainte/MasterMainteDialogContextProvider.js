import { createContext } from 'react';

export const DialogModelContext = createContext();
export const DialogPageContext = createContext();

// dialogModelはprops経由でDialogコンポーネントに渡すことができないため
// ContextProvider経由にしている
export function MasterMainteDialogContextProvider({ dialogModel, dialogPageContext, children }) {
  return (
    <DialogPageContext.Provider value={dialogPageContext}>
      <DialogModelContext.Provider value={dialogModel}>{children}</DialogModelContext.Provider>
    </DialogPageContext.Provider>
  );
}
