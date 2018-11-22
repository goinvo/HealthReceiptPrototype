import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';

export default function configureStore(persistedState) {
  return createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunk)
  );
}
