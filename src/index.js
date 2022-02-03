import SessionContextProvider from 'app/provider/SessionContextProvider';
import { RmsRouter } from 'app/router/RmsRouter';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <CssBaseline />
      <SessionContextProvider>
        <RmsRouter />
      </SessionContextProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
