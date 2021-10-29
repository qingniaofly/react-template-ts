import React, { memo } from "react"
import { Route, Switch } from "react-router"
import Demo from "./demo"

const Test = () => {
    return <div>I am test container</div>
}
const Routes = () => {
    return (
        <Switch>
            <Route exact path={`/demo/test`} component={Test} />
            <Route exact path={`/demo`} component={Demo} />
            <Route path={`/`} component={Demo} />
        </Switch>
    )
}

export default memo(Routes)
