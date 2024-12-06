import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import questionReducer from './questionReduser';
import testReducer from './testReduser';
import { thunk } from 'redux-thunk';

const rootReducer = combineReducers({
  questions: questionReducer,
  tests: testReducer,
});

export const store = legacy_createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);
export type AppRootStateItems = ReturnType<typeof rootReducer>;

export default store;
