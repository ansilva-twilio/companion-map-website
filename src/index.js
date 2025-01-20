import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';

import { APIProvider } from "@vis.gl/react-google-maps";

const root = ReactDOM.createRoot(document.getElementById('root'));
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <App />
      </APIProvider>
    </BrowserRouter>
  </React.StrictMode>
);

