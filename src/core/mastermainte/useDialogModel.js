import { ValidatableField } from 'core/field/ValidatableField';
import { useState } from 'react';

const addToServer = async (addModel, apiContext, setLoading) => {
  const result = { success: false };
  try {
    setLoading(true);
    const serverApi = apiContext.masterContext.serverApi;
    const newId = await serverApi.add(addModel);
    apiContext.messageState.pushMessage(null, '追加しました', 'success');
    result.success = true;
    result.newId = newId;
  } catch (error) {
    apiContext.messageState.pushMessage(error.code, error.message);
  } finally {
    setLoading(false);
  }
  return result;
};

const upateToServer = async (updateModel, apiContext, setLoading) => {
  let success = false;
  try {
    setLoading(true);
    const serverApi = apiContext.masterContext.serverApi;
    await serverApi.update(updateModel);
    apiContext.messageState.pushMessage(null, '更新しました', 'success');
    success = true;
  } catch (error) {
    apiContext.messageState.pushMessage(error.code, error.message);
  } finally {
    setLoading(false);
  }
  return success;
};

const deleteToServer = async (deleteId, apiContext, setLoading) => {
  let success = false;
  try {
    setLoading(true);
    const serverApi = apiContext.masterContext.serverApi;
    await serverApi.delete(deleteId);
    apiContext.messageState.pushMessage(null, '削除しました', 'success');
    success = true;
  } catch (error) {
    apiContext.messageState.pushMessage(error.code, error.message);
  } finally {
    setLoading(false);
  }
  return success;
};

export const useDialogModel = (rows, dispach, apiContext) => {
  const entityClass = apiContext.masterContext.entityClass;
  const dialogInput = useDialogInput(entityClass);
  const [targetDialogContent, setTargetDialogContent] = useState();
  const [loading, setLoading] = useState(false);

  const begin = (targetId) => {
    dialogInput.begin(targetId, rows);
    setTargetDialogContent(null);
  };
  const beginForReference = (targetRow, targetClass, dialogContent) => {
    dialogInput.beginForReference(targetRow, targetClass);
    setTargetDialogContent(dialogContent);
  };
  const input = (key, value) => {
    dialogInput.input(key, value);
  };
  const restoreTarget = () => {
    dialogInput.restoreTarget();
  };
  const addTarget = async () => {
    if (!dialogInput.validateAll()) {
      return false;
    }
    const addModel = entityClass.toObject(dialogInput.target);
    const result = await addToServer(addModel, apiContext, setLoading);
    if (!result.success) {
      return false;
    }
    addModel.id = result.newId;
    dispach({ type: 'ADD', target: addModel });
    return true;
  };
  const updateTarget = async () => {
    const updateModel = entityClass.toObject(dialogInput.target);
    const result = await upateToServer(updateModel, apiContext, setLoading);
    if (!result) {
      return false;
    }
    dispach({ type: 'UPDATE', target: updateModel });
    dialogInput.backupTarget();
    return true;
  };
  const deleteTarget = (pageContext) => {
    // work around to https://github.com/mui-org/material-ui-x/issues/2714
    setTimeout(async () => {
      const deleteId = dialogInput.target.id;
      if (await deleteToServer(deleteId, apiContext, setLoading)) {
        dispach({ type: 'DELETE', id: dialogInput.target.id });
        pageContext.setOpenDialog(false);
      }
    });
  };
  const getDialogContent = (defaultContent) => {
    return targetDialogContent || defaultContent;
  };
  const revalidateOnDep = (changeField) => {
    dialogInput.revalidateOnDep(changeField);
  };

  return {
    target: dialogInput.target,
    targetDialogContent,
    begin,
    beginForReference,
    input,
    restoreTarget,
    addTarget,
    updateTarget,
    deleteTarget,
    getDialogContent,
    revalidateOnDep,
    loading,
  };
};

const useDialogInput = (entityClass) => {
  const [target, setTarget] = useState();
  const [backup, setBackup] = useState();

  const begin = (targetId, rows) => {
    if (!targetId) {
      // add pattern
      const targetFields = entityClass.emptyFieldsFactory();
      setTarget(targetFields);
      setBackup(entityClass.toObject(targetFields));
      return;
    }
    const row = rows.find((row) => row.id === targetId);
    const targetFields = entityClass.toFields(row);
    setTarget(targetFields);
    setBackup(entityClass.toObject(targetFields));
  };
  const beginForReference = (targetRow, targetClass) => {
    const targetFields = targetClass.toFields(targetRow);
    setTarget(targetFields);
    setBackup(targetClass.toObject(targetFields));
  };
  const input = (key, value) => {
    target[key].value = value;
    target[key].validate(target);
    setTarget({ ...target });
  };
  const restoreTarget = () => {
    setTarget(entityClass.toFields(backup));
  };
  const backupTarget = () => {
    setBackup(entityClass.toObject(target));
  };
  const validateAll = () => {
    if (!ValidatableField.validateAll(target)) {
      setTarget({ ...target });
      return false;
    }
    return true;
  };

  const revalidateOnDep = (changeField) => {
    if (!target[changeField].depended) {
      return;
    }
    const dependedFieldNames = target[changeField].depended;
    [...dependedFieldNames].forEach((dep) => {
      target[dep].validate(target);
    });
    setTarget({ ...target });
  };

  return {
    target,
    begin,
    beginForReference,
    input,
    restoreTarget,
    backupTarget,
    validateAll,
    revalidateOnDep,
  };
};
