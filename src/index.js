import SessionContextProvider from 'app/provider/SessionContextProvider';
import { RmsRouter } from 'app/router/RmsRouter';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <CssBaseline />
      <SessionContextProvider>
        <RmsRouter />
      </SessionContextProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
