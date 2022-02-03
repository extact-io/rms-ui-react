import { useState } from 'react';
import { makeStyles, TableCell, TableSortLabel } from '@material-ui/core';

function descComparator(o1, o2, orderBy) {
  if (o2[orderBy] < o1[orderBy]) {
    return -1;
  }
  if (o2[orderBy] > o1[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderProperty) {
  return order === 'desc'
    ? (o1, o2) => descComparator(o1, o2, orderProperty)
    : (o1, o2) => -descComparator(o1, o2, orderProperty);
}

export const useSortOrder = (initOrderProperty, initOrder = 'asc') => {
  const [order, setOrder] = useState(initOrder);
  const [orderProperty, setOrderProperty] = useState(initOrderProperty);

  const changeOrder = (property) => {
    const isAsc = orderProperty === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderProperty(property);
  };

  const sortByOrder = (rows, comparator = getComparator(order, orderProperty)) => {
    const sortRows = rows.map((el, index) => [el, index]);
    sortRows.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return sortRows.map((el) => el[0]);
  };

  return [order, orderProperty, changeOrder, sortByOrder];
};

const useStyles = makeStyles(() => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function SortableTableHeaderCell(props) {
  const { property, order, orderProperty, handleSortOrder, children, ...other } = props;
  const classes = useStyles();
  return (
    <TableCell sortDirection={orderProperty === property ? order : false} {...other}>
      <TableSortLabel
        active={orderProperty === property}
        direction={orderProperty === property ? order : 'asc'}
        onClick={() => handleSortOrder(property)}
      >
        {children}
        {orderProperty === property ? (
          <span className={classes.visuallyHidden}>
            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </span>
        ) : null}
      </TableSortLabel>
    </TableCell>
  );
}
