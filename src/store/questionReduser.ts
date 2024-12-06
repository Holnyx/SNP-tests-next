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
      const { questionId, answer } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        question.answer.push(answer);
      }
    },
    removeAnswer(
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) {
      const { questionId, answerId } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        question.answer = question.answer.filter(a => a.id !== answerId);
      }
    },
    updateAnswersOrder: (
      state,
      action: PayloadAction<{ questionId: string; newOrder: AnswerItem[] }>
    ) => {
      const { questionId, newOrder } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        question.answer = newOrder;
      }
    },
  },
});

export const {
  addQuestion,
  removeQuestion,
  addAnswer,
  removeAnswer,
  removeAllQuestion,
  updateAnswersOrder,
} = questionSlice.actions;

export default questionSlice.reducer;
