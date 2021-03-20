import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router";
import Spinner from "../../components/spinner";

const UserInput = lazy(() => import("../user-input"));
const Result = lazy(() => import("../result"));

class Body extends React.Component {

    render() {
        return (
            <>
                <Switch>
                    <Suspense fallback={<Spinner />}>
                        <Route path="/" component={UserInput} exact />
                        <Route path="/result" component={Result} />
                    </Suspense>
                </Switch>
            </>
        );
    }
}

export default Body;
