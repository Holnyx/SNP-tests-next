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
      state.testsList = state.testsList.filter(
        test => test.id !== action.payload.id
      );
    },
    sortTestsByDateAsc: state => {
      state.testsList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    },
    sortTestsByDateDesc: state => {
      state.testsList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    },
    initTestsFromStorage: (state, action: PayloadAction<TestsItem[]>) => {
      state.testsList = [...action.payload];
    },
  },
});

export const {
  addTest,
  initTestsFromStorage,
  removeTest,
  sortTestsByDateAsc,
  sortTestsByDateDesc,
} = testSlice.actions;

export default testSlice.reducer;
