import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilteredTestsByDate, TestsItem, TestsState } from './types';
import { setCookie } from 'cookies-next';

const initialState: TestsState = {
  testsList: [],
  searchQuery: '',
  errors: [],
  sortOrder: 'desc',
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
    filteredTestsByDate(state, action: PayloadAction<FilteredTestsByDate>) {
      state.sortOrder = action.payload;
    },
    initTestsFromStorage: (state, action: PayloadAction<TestsItem[]>) => {
      state.testsList = [...action.payload];
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addTest,
  initTestsFromStorage,
  removeTest,
  setSearchQuery,
  filteredTestsByDate,
} = testSlice.actions;

export default testSlice.reducer;
