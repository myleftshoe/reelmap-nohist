import React from 'react'
import StateProvider from "./app-state-provider"
import App from './app'

const AppContainer = () =>
    <StateProvider>{([state, dispatch]) =>
        <App state={state} dispatch={dispatch} />}
    </StateProvider>

export default AppContainer;