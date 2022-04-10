import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";
import MainPage from "../../pages/MainPage";
import ComicsPage from "../../pages/ComicsPage";
import SingleComicPage from "../../pages/SingleComicPage";

const Page404 = lazy(() => import("../../pages/404"));
// import Page404 from "../../pages/404";

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader />
                <Suspense fallback={<Spinner />}>
                    <main>
                        <Switch>
                            <Route exact path="/">
                                <MainPage />
                            </Route>
                            <Route exact path="/comics">
                                <ComicsPage/>
                            </Route>
                            <Route exact path="/comics/:comicId">
                                <SingleComicPage/>
                            </Route>
                            <Route exact path="*">
                                <Page404/>
                            </Route>
                        </Switch>
                    </main>
                </Suspense>
            </div>
        </Router>
    );
};

export default App;
