import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch } from "react-router-dom"
import { createBrowserHistory } from 'history'
import './index.css';
import * as serviceWorker from './serviceWorker';
import { GoogleMapProvider } from '@googlemap-react/core';
import { Provider as DataProvider } from 'outstated';
import dataStore from './stores/mock-data-store';
import AppContainer from './app-container';
import Single from "./single"

const history = createBrowserHistory()

ReactDOM.render(
    <GoogleMapProvider>
        <DataProvider stores={[dataStore]}>
            <Router history={history}>
                <Switch>
                    <Route path="/:id" component={Single} />
                    <Route path="/" component={AppContainer} />
                </Switch>
            </Router>
        </DataProvider>
    </GoogleMapProvider>
    ,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
