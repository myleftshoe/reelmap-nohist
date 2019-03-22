import React from "react"
import { Route, Switch } from "react-router-dom"
import App from "./app"

const Routes = () => {
    return (
        <Switch>
            {/* <Route exact path="/" component={App} /> */}
            <Route path="/:id" component={App} />
            {/* <Route path="/CHA" component={App} />
            <Route path="/DRK" component={App} /> */}
            <Route component={App} />
        </Switch>
    )
}

export default Routes