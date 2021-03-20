import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducers from "./redux/reducers";

import Spinner from './components/spinner';

// application root where contents will be
// dynamically rendered by react dom...
const root = document.getElementById("root");
// lazily importing app page...
const App = lazy(() => import("./pages/app"));
// lazily importing error page...
const Error = lazy(() => import("./pages/error"));

/**
 * This method is executed before initiating
 * render. You should initialize necessary components
 * here before application starts.
 * @returns {Object} Returns an object containing results if any.
 */
const onBeforeRenderAsync = async () => {
    // creating redux store...
    const reduxStore = createStore(
        reducers,
        // used by Redux DevTools extension...
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__()
    );

    return {
        isSuccessful: true,
        reduxStore: reduxStore
    };
};

onBeforeRenderAsync().then(result => {
    ReactDOM.render(
        <React.StrictMode>
            <BrowserRouter>
                <Suspense fallback={<Spinner />}>
                    {
                        result.isSuccessful &&
                        <Provider store={result.reduxStore}>
                            <App />
                        </Provider>
                    }
                    { !result.isSuccessful && <Error statusCode={400} message="Failed to load necessary components." /> }
                </Suspense>
            </BrowserRouter>
        </React.StrictMode>, root
    );
});
