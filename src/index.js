import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { GoogleMapProvider } from '@googlemap-react/core';
import { Provider } from 'outstated';
import dataStore from './stores/data-store';

ReactDOM.render(
    <GoogleMapProvider>
        <Provider stores={[dataStore]}>
            <App />
        </Provider>
    </GoogleMapProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
