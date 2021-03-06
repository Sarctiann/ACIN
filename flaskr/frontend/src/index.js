import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import GlobalContext from './components/tools/contexts'

import App from './components/App';

ReactDOM.render(
    <>
      <BrowserRouter>
        <GlobalContext>
          <App />
        </GlobalContext>
      </BrowserRouter>
    </>,
  document.getElementById('root')
);
