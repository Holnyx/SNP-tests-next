import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createAnswerThunk,
  createQuestionThunk,
  deleteAnswerThunk,
  deleteQuestionThunk,
  editAnswerThunk,
  editQuestionThunk,
  getQuestionsThunk,
  moveAnswerThunk,
} from '@/thunk/testsThunk';

import { AnswerItem, QuestionItem, QuestionState } from './types';

const initialState: QuestionState = {
  questionsList: [],
  answers: [],
  errors: [],
  loading: false,
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion(state, action: PayloadAction<QuestionItem>) {
      state.questionsList.unshift(action.payload);
    },
    removeQuestion(state, action: PayloadAction<{ questionId: string }>) {
      state.questionsList = state.questionsList.filter(
        question => question.id !== action.payload.questionId
      );
    },
    removeAllQuestion(state) {
      state.questionsList = [];
    },
    addAnswer(
      state,
      action: PayloadAction<{ questionId: string; newAnswer: AnswerItem }>
    ) {
      const { questionId, newAnswer } = action.payload;
      const question = state.questionsList.find(q => q.id === questionId);
      if (question) {
        if (!Array.isArray(question.answers)) {
          question.answers = [];
        }
        question.answers.push(newAnswer);
      }
    },
    removeAnswer(
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) {
      const { questionId, answerId } = action.payload;
      const question = state.questionsList.find(q => q.id === questionId);
      if (question) {
        question.answers = question.answers.filter(a => a.id !== answerId);
      }
    },
    updateAnswersOrder(
      state,
      action: PayloadAction<{ questionId: string; newOrder: AnswerItem[] }>
    ) {
      const { questionId, newOrder } = action.payload;
      const question = state.questionsList.find(q => q.id === questionId);
      if (question) {
        question.answers = newOrder;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getQuestionsThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(getQuestionsThunk.fulfilled, (state, action) => {
        state.questionsList = action.payload;
        state.loading = false;
      })
      .addCase(getQuestionsThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(createQuestionThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.questionsList.push(action.payload);
        state.loading = false;
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(editQuestionThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(editQuestionThunk.fulfilled, (state, action) => {
        const index = state.questionsList.findIndex(
          q => q.id === action.payload.id
        );
        if (index !== -1) {
          state.questionsList[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(deleteQuestionThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(deleteQuestionThunk.fulfilled, (state, action) => {
        state.questionsList = state.questionsList.filter(
          q => q.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(createAnswerThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(createAnswerThunk.fulfilled, (state, action) => {
        state.answers.push(action.payload);
        state.loading = false;
      })
      .addCase(createAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(editAnswerThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(editAnswerThunk.fulfilled, (state, action) => {
        const index = state.answers.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.answers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(deleteAnswerThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(deleteAnswerThunk.fulfilled, (state, action) => {
        state.answers = state.answers.filter(a => a.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      })
      .addCase(moveAnswerThunk.pending, state => {
        state.errors = [];
        state.loading = true;
      })
      .addCase(moveAnswerThunk.fulfilled, (state, action) => {
        const index = state.answers.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.answers[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(moveAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
        state.loading = false;
      });
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
