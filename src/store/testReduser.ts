// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { AnswerItem, QuestionItem, TestsItem, TestsState } from './types';

// const initialState: TestsState = {
//   testsList: [],
//   searchQuery: '',
//   errors: [],
// };

// const testsSlice = createSlice({
//   name: 'tests',
//   initialState,
//   reducers: {
//     updateTempTestTitle(state, action: PayloadAction<string>) {
//       state.testsList.find(t => (t.title = action.payload));
//     },
//     addTempQuestion(state, action: PayloadAction<QuestionItem>) {
//       state.testsList.map(q => q.questions.push(action.payload));
//     },
//     addTempAnswer(state, action: PayloadAction<AnswerItem>) {
//       const question = state.testsList.find(t =>
//         t.questions.find(q => q.id === action.payload.id)
//       );
//       if (question) {
//         question.questions.find(q => q.answer)?.answer.push(action.payload);
//       }
//     },
//     addTest(state, action: PayloadAction<TestsItem>) {
//       state.testsList.push(action.payload);
//     },
//   },
// });

// export const { addTest } =
//   testsSlice.actions;

// export default testsSlice.reducer;
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
      state.testsList.unshift(action.payload);
    },
  },
});

export const { addTest } = testSlice.actions;

export default testSlice.reducer;
