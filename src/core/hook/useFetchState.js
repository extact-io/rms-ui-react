import { useState } from 'react';
import { useMountedState } from 'react-use';

export function useFetchState(messageState) {
  const isMounted = useMountedState();
  const [fetchStates, setFetchStates] = useState({
    resultRows: null,
    error: null,
    loading: true,
  });
  const invokeFetch = async (invoker) => {
    changeToStartState();
    try {
      const data = await invoker();
      changeToEndState(data);
    } catch (error) {
      changeToErrorState(error);
    }
  };
  const changeToStartState = () => {
    setFetchStates({ resultRows: null, error: null, loading: true });
  };
  const changeToEndState = (rows) => {
    if (isMounted()) {
      setFetchStates({ resultRows: rows, error: null, loading: false });
    }
  };
  const changeToErrorState = (error) => {
    if (isMounted()) {
      messageState.pushMessage(error.code, error.message);
      setFetchStates({ resultRows: null, error: error, loading: false });
    }
  };
  const removeRow = (id) => {
    const removedRows = fetchStates.resultRows.filter((row) => {
      return row.id !== id;
    });
    setFetchStates({ ... fetchStates, resultRows: removedRows});
  };
  const getStateMessage = (notFoundMessage = '該当なし') => {
    if (fetchStates.loading) {
      return 'ロード中...';
    }
    if (fetchStates.resultRows && fetchStates.resultRows.length == 0) {
      return notFoundMessage;
    }
    return null;
  };
  const nowLoading = () => {
    return fetchStates.loading;
  };
  const shouldOutputMessage = () => {
    return !!getStateMessage();
  };
  const shouldRenerRows = () => {
    return !fetchStates.loading && fetchStates.resultRows && fetchStates.resultRows.length !== 0;
  };
  return {
    ...fetchStates,
    invokeFetch,
    changeToStartState,
    changeToEndState,
    changeToErrorState,
    removeRow,
    getStateMessage,
    nowLoading,
    shouldOutputMessage,
    shouldRenerRows,
  };
}
