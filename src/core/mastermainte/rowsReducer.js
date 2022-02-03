export const rowsReducer = (rows, action) => {
  switch (action.type) {
    case 'INIT': {
      return action.initRows;
    }
    case 'ADD': {
      return [...rows, action.target];
    }
    case 'UPDATE': {
      return rows.map((row) => {
        if (row.id !== action.target.id) {
          return row;
        }
        return { ...action.target };
      });
    }
    case 'DELETE': {
      return rows.filter((row) => row.id !== action.id);
    }
    default:
      return rows;
  }
};
