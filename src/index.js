import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Switch } from "react-router-dom"
import { createBrowserHistory } from 'history'
import './index.css'
import * as serviceWorker from './serviceWorker'
import { GoogleMapProvider } from '@googlemap-react/core'
import { Provider as DataProvider } from 'outstated'
import dataStore from './app/mock-data-store'
import driverStore from './app/driver-store'
import toastStore from './toasts/store'
import AppContainer from './app/app-container'

const history = createBrowserHistory()

ReactDOM.render(
    <GoogleMapProvider>
        <DataProvider stores={[dataStore, driverStore, toastStore]}>
            <Router history={history}>
                <Switch>
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
