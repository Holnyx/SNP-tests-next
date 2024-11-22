import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerItem, QuestionItem, TestsItem, TestsState } from './types';

const initialState: QuestionItem[] = [];

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion(state, action: PayloadAction<QuestionItem>) {
      state.unshift(action.payload);
    },
    removeQuestion(state, action: PayloadAction<{ questionId: string }>) {
      return state.filter(element => element.id !== action.payload.questionId);
    },
    removeAllQuestion(state) {
      return [];
    },
    addAnswer(
      state,
      action: PayloadAction<{ questionId: string; answer: AnswerItem }>
    ) {
      const question = state.find(
        element => element.id === action.payload.questionId
      );

      if (question) {
        question.answer.unshift(action.payload.answer);
      }
    },
    removeAnswer(
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) {
      const question = state.find(
        element => element.id === action.payload.questionId
      );
      if (question) {
        question.answer = question.answer.filter(
          element => element.id !== action.payload.answerId
        );
      }
    },
  },
});

export const { addQuestion, removeQuestion, addAnswer, removeAnswer, removeAllQuestion } =
  questionSlice.actions;

export default questionSlice.reducer;
