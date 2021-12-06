import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import GlobalContext from './components/tools/contexts'

import App from './components/App';

ReactDOM.render(
    <>
      <CssBaseline />
      <BrowserRouter>
        <GlobalContext>
          <App />
        </GlobalContext>
      </BrowserRouter>
    </>,
  document.getElementById('root')
);
