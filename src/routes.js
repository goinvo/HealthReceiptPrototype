import React from 'react';
import { Route, Switch } from 'react-router-dom'

import App from './App'
import SignIn from './components/signIn'
import Patient from './components/patient'
import { NotFound } from './404'

export const Routes = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/patient/:patientId" component={Patient} />
        <Route component={NotFound} />
      </Switch>
    </div>
  )
}
