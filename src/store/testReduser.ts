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
    updateTests(state, action: PayloadAction<TestsItem>) {
      const updatedTestIndex = state.testsList.findIndex(test => test.id === action.payload.id);
      if (updatedTestIndex !== -1) {
        state.testsList[updatedTestIndex] = {
          ...state.testsList[updatedTestIndex],
          ...action.payload,
        };
      }
    },
    filteredTestsByDate(state, action: PayloadAction<FilteredTestsByDate>) {
      state.sortOrder = action.payload;
    },
    initTestsFromStorage: (state, action: PayloadAction<TestsItem[]>) => {
      state.testsList = action.payload
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
  updateTests,
} = testSlice.actions;

export default testSlice.reducer;
