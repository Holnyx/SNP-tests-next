import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TestsItem, TestsState } from './types';

const initialState: TestsState = {
  testsList: [],
  searchQuery: '',
  errors: [],
};

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    addTest(state, action: PayloadAction<TestsItem>) {
      state.testsList.push(action.payload);
    },
    removeTest(state, action: PayloadAction<{ id: string }>) {
      state.testsList = state.testsList.filter(test => test.id !== action.payload.id);
    },
    initTestsFromStorage: (state, action: PayloadAction<TestsItem[]>) => {
      state.testsList = [...action.payload];
    },
  },
});

export const { addTest, initTestsFromStorage, removeTest } = testSlice.actions;

export default testSlice.reducer;
