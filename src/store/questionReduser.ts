import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerItem, QuestionItem } from './types';
import { getQuestionsThunk } from '@/thunk/testsThunk';

const initialState: QuestionItem[] = [];

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion(state, action: PayloadAction<QuestionItem>) {
      state.unshift(action.payload);
    },
    removeQuestion(state, action: PayloadAction<{ questionId: string }>) {
      return state.filter(
        question => question.id !== action.payload.questionId
      );
    },
    removeAllQuestion() {
      return [];
    },
    addAnswer(
      state,
      action: PayloadAction<{ questionId: string; newAnswer: AnswerItem }>
    ) {
      const { questionId, newAnswer } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        if (!Array.isArray(question.answers)) {
          question.answers = [];
        }
        if (newAnswer && newAnswer.text) {
          question.answers.push(newAnswer);
        }
      }
    },
    removeAnswer(
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) {
      const { questionId, answerId } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        question.answers = question.answers.filter(a => a.id !== answerId);
      }
    },
    updateAnswersOrder(
      state,
      action: PayloadAction<{ questionId: string; newOrder: AnswerItem[] }>
    ) {
      const { questionId, newOrder } = action.payload;
      const question = state.find(q => q.id === questionId);
      if (question) {
        question.answers = newOrder;
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(
      getQuestionsThunk.fulfilled,
      (state, action: PayloadAction<QuestionItem[]>) => {
        return action.payload;
      }
    );
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
