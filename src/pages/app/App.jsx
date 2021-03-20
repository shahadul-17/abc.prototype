import React, { lazy } from "react";

const Body = lazy(() => import("../body"));

class App extends React.Component {

    render() {
        return (
            <>
                <Body />
            </>
        );
    }
}

export default App;
