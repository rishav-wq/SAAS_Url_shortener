// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import { store } from './app/store';
import App from './App';
import './index.css'; // Import Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* Wrap App with Router */}
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
);
