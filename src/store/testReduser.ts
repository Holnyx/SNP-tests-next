import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FilteredTestsByDate,
  QuestionItem,
  TestsItem,
  TestsState,
} from './types';
import {
  createTestFlow,
  deleteTestThunk,
  getAllTestsThunk,
  getTestByIdThunk,
  updateTestThunk,
} from '@/thunk/testsThunk';

const initialState: TestsState = {
  testsList: [],
  questionsList: [],
  searchQuery: '',
  errors: [],
  sortOrder: 'desc',
  test: null,
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
        (state, action: PayloadAction<{ tests: TestsItem[] }>) => {
          state.testsList = action.payload.tests;
        }
      )
      .addCase(getAllTestsThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(getTestByIdThunk.pending, state => {
        state.errors = [];
      })
      .addCase(getTestByIdThunk.fulfilled, (state, action) => {
        state.test = action.payload;
      })
      .addCase(getTestByIdThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(
        createTestFlow.fulfilled,
        (
          state,
          action: PayloadAction<{
            createdTest: TestsItem;
            createdQuestions: QuestionItem[];
          }>
        ) => {
          const { createdTest, createdQuestions } = action.payload;
          state.testsList.push(createdTest);
          state.questionsList.push(...createdQuestions);
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
