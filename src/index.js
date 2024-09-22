// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS (for collapse, modal, etc.)

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Importing custom global styles
import App from './App';
import reportWebVitals from './reportWebVitals'; // Optional

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to measure performance
reportWebVitals();
