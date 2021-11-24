import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import App from './components/App';

ReactDOM.render(
    <>
    <CssBaseline />
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </>,
  document.getElementById('root')
);
