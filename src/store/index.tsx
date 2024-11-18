import { applyMiddleware, combineReducers, legacy_createStore } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import questionReducer from './questionReduser';
import testReducer from './testReduser';
import { thunk } from 'redux-thunk';
import answersReducer from './answersReducer';

const rootReducer = combineReducers({
  questions: questionReducer,
  tests: testReducer,
  answers: answersReducer,
});

export const store = legacy_createStore(
  rootReducer,
  {},
  applyMiddleware(thunk)
);
export type AppRootStateItems = ReturnType<typeof rootReducer>;

export default store;
