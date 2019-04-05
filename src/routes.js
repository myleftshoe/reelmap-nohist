import React from "react"
import { Route, Switch } from "react-router-dom"
import App from "./app"
import Single from "./single"
import StateProvider from "./state-provider";

const Routes = () => {
    return (
        <Switch>
            <Route path="/:id" component={Single} />
            <Route render={props =>
                <StateProvider>{([state, dispatch]) =>
                    <App state={state} dispatch={dispatch} />}
                </StateProvider>}
            />
        </Switch>
    )
}

export default Routes