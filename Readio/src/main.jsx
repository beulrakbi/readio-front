import { createRoot } from 'react-dom/client'; // createRoot를 직접 import
import { Provider } from 'react-redux';
import App from './App.jsx';
import store from './Store.js';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
);