import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { thunk } from 'redux-thunk';

import authReducer from './authReducer';
import questionReducer from './questionReducer';
import testReducer from './testReducer';

const rootReducer = combineReducers({
  questions: questionReducer,
  tests: testReducer,
  auth: authReducer,
});

export const store = legacy_createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);

export type AppDispatch = typeof store.dispatch;
export type AppRootStateItems = ReturnType<typeof rootReducer>;

export default store;
