import { useState } from 'react';

const DETAIL_CONTEXT = {
  title: '詳細',
  editable: false,
  ignoreBackdropClick: false,
};
const EDIT_CONTEXT = {
  title: '編集',
  editable: true,
  ignoreBackdropClick: true,
};
const ADD_CONTEXT = {
  title: '追加',
  editable: true,
  ignoreBackdropClick: true,
};

const contextMap = {
  detail: DETAIL_CONTEXT,
  edit: EDIT_CONTEXT,
  add: ADD_CONTEXT,
};

export const useDialogPageContext = () => {
  const [currentContext, setPageContext] = useState();
  const [detailPageBack, setDetailPageBack] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [referenceOnly, setReferenceOnly] = useState(false);
  const changeMode = (nextMode, referenceOnly = false) => {
    // 詳細ダイアログ => 編集ダイアログへの遷移
    if (currentContext === DETAIL_CONTEXT && nextMode === 'edit') {
      setDetailPageBack(true);
    }
    // 編集ダイアログ => 詳細ダイアログへの遷移
    if (currentContext === EDIT_CONTEXT && nextMode === 'detail') {
      setDetailPageBack(false);
    }
    // 詳細ダイアログの場合は参照のみかを設定
    if (nextMode === 'detail') {
      setReferenceOnly(referenceOnly);
    }
    setPageContext(contextMap[nextMode]);
  };
  const extPageContext = {
    ...currentContext,
    isDetailPageBack() {
      return detailPageBack;
    },
    reset() {
      setPageContext(null);
      setDetailPageBack(false);
      setReferenceOnly(false);
    },
    isEdit() {
      return currentContext === EDIT_CONTEXT;
    },
    isDetail() {
      return currentContext === DETAIL_CONTEXT;
    },
    isAdd() {
      return currentContext === ADD_CONTEXT;
    },
    isReferenceOnly() {
      return referenceOnly;
    },
    openDialog: openDialog,
    setOpenDialog(open) {
      setOpenDialog(open);
    },
    changeMode,
  };
  return extPageContext;
};
