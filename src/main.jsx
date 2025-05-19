import React from 'react';
import { createRoot } from 'react-dom/client'; // createRoot를 직접 import
import App from './App.jsx';
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
);