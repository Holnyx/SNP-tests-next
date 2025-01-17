import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import questionReducer from './questionReduser';
import testReducer from './testReduser';
import { thunk } from 'redux-thunk';
import authReducer from './authReducer';

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
