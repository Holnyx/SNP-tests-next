import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FilteredTestsByDate,
  QuestionItem,
  TestsItem,
  TestsState,
} from './types';
import {
  createTestThunk,
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
  sortOrder: 'created_at_desc',
  test: null,
  loading: false,
  deleteLoading: false,
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
        state.loading = true;
      })
      .addCase(
        getAllTestsThunk.fulfilled,
        (state, action: PayloadAction<{ tests: TestsItem[] }>) => {
          state.testsList = action.payload.tests;
          state.loading = false;
        }
      )
      .addCase(getAllTestsThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(getTestByIdThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(getTestByIdThunk.fulfilled, (state, action) => {
        state.test = action.payload;
        state.loading = false;
      })
      .addCase(getTestByIdThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(createTestThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(
        createTestThunk.fulfilled,
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
          state.loading = false;
        }
      )
      .addCase(createTestThunk.rejected, (state, action) => {
        state.loading = false;
        state.errors.push(action.payload as string);
      })
      .addCase(deleteTestThunk.pending, state => {
        state.errors = [];
        state.deleteLoading = true;
      })
      .addCase(
        deleteTestThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.testsList = state.testsList.filter(
            test => test.id !== action.payload
          );
          state.deleteLoading = false;
        }
      )
      .addCase(deleteTestThunk.rejected, (state, action) => {
        action.payload && state.errors.push(action.payload as string);
        state.deleteLoading = false;
      })
      .addCase(updateTestThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(
        updateTestThunk.fulfilled,
        (state, action: PayloadAction<TestsItem>) => {
          const index = state.testsList.findIndex(
            test => test.id === action.payload.id
          );
          if (index !== -1) {
            state.testsList[index] = action.payload;
          }
          state.loading = false;
        }
      )
      .addCase(updateTestThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      });
  },
});

export const { setSearchQuery, clearError, filteredTestsByDate } =
  testSlice.actions;
export default testSlice.reducer;
