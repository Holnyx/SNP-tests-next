import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
// import musicReducer from './musicReducer';
// import rootSaga from '@/saga/musicSaga';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  // musicList: musicReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(sagaMiddleware),
});
export type AppRootStateItems = ReturnType<typeof rootReducer>;

// sagaMiddleware.run(rootSaga);

export default store;
