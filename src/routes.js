import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom'

import Home from './components/home'
import SignIn from './components/signIn'
import Encounter from './components/encounter'
import { NotFound } from './404'

function PrivateRoute({ component: Component, store, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        store.getState().setPatient.patient ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export const Routes = (props) => {
  const store = props.store

  return (
    <div>
      <Switch>
        <Route path="/sign-in" component={SignIn} />
        <PrivateRoute exact path="/" component={Home} store={store} />
        <PrivateRoute path="/encounter/:encounterId" component={Encounter} store={store} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
