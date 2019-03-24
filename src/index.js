import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import * as serviceWorker from './serviceWorker';
import { GoogleMapProvider } from '@googlemap-react/core';
import { Provider } from 'outstated';
import dataStore from './stores/data-store';
// import Routes from "./routes"
// import { Router } from "react-router-dom"
// import { createBrowserHistory } from 'history'
// const history = createBrowserHistory()

function AppContainer({ store }) {
    return (
        <GoogleMapProvider>
            <Provider stores={[store]}>
                <App />
                {/* <Router history={history}>
                    <Routes />
                </Router>, */}
            </Provider>
        </GoogleMapProvider>
    )
}

ReactDOM.render(
    <AppContainer store={dataStore} />,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
