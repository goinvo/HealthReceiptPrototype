import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';

import configureStore from './store';
import './styles/index.scss';
import { Routes } from './routes'
import * as serviceWorker from './serviceWorker';

const persistedPatient = localStorage.getItem('patient') ? JSON.parse(localStorage.getItem('patient')) : {}

let store

if (persistedPatient) {
  store = configureStore(persistedPatient)
} else {
  store = configureStore()
}

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Routes store={store}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
