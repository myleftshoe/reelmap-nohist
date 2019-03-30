import React from "react"
import { Route, Switch } from "react-router-dom"
import App from "./app"
import Single from "./single"

const Routes = () => {
    return (
        <Switch>
            <Route path="/:id" component={Single} />
            <Route component={App} />
        </Switch>
    )
}

export default Routes