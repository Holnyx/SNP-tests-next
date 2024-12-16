import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilteredTestsByDate, TestsItem, TestsState } from './types';
import {
  addTestThunk,
  deleteTestThunk,
  getAllTestsThunk,
  updateTestThunk,
} from '@/thunk/testsThunk';

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
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearError(state, action: PayloadAction<number>) {
      state.errors = state.errors.filter(
        (_, index) => index !== action.payload
      );
    },
    filteredTestsByDate(state, action: PayloadAction<FilteredTestsByDate>) {
      state.sortOrder = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllTestsThunk.pending, state => {
        state.errors = [];
      })
      .addCase(
        getAllTestsThunk.fulfilled,
        (state, action: PayloadAction<TestsItem[]>) => {
          state.testsList = action.payload;
        }
      )
      .addCase(getAllTestsThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(
        addTestThunk.fulfilled,
        (state, action: PayloadAction<TestsItem>) => {
          state.testsList.push(action.payload);
        }
      )
      .addCase(
        deleteTestThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.testsList = state.testsList.filter(
            test => test.id !== action.payload
          );
        }
      )
      .addCase(
        updateTestThunk.fulfilled,
        (state, action: PayloadAction<TestsItem>) => {
          const index = state.testsList.findIndex(
            test => test.id === action.payload.id
          );
          if (index !== -1) {
            state.testsList[index] = action.payload;
          }
        }
      );
  },
});

export const { setSearchQuery, clearError, filteredTestsByDate } =
  testSlice.actions;
export default testSlice.reducer;
