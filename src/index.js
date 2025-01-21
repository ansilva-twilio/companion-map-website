import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import { APIProvider } from "@vis.gl/react-google-maps";

import './index.css';
import App from './App';

const fetchGoogleMapsApiKey = async () => {
  try {
    const response = await axios.get('https://companion-map-2213.twil.io/getGoogleMapsCredentials.js');
    return response.data.apiKey;
  } catch (error) {
    console.error('Error fetching Google Maps API key:', error);
    throw error;
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <APIProvider apiKey={await fetchGoogleMapsApiKey()} onLoad={() => console.log('Maps API has loaded.')}>
        <App />
      </APIProvider>
    </BrowserRouter>
  </React.StrictMode>
);

