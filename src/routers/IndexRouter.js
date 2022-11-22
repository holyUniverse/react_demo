import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "../views/login/Login";
import SandBox from "../views/sandbox/SandBox";

export default function IndexRouter() {
  return (
    <HashRouter>
      <Switch>
        <Route path={"/login"} component={Login} />
        <Route
          path={"/"}
          render={() =>
            localStorage.getItem("token") ? (
              <SandBox />
            ) : (
              <Redirect to={"/login"} />
            )
          }
        />
      </Switch>
    </HashRouter>
  );
}
