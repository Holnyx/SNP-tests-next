import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerItem, QuestionItem, QuestionState } from './types';
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
const initialState: QuestionState = {
  questionsList: [],
  answers: [],
  errors: [],
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
      })
      .addCase(getQuestionsThunk.fulfilled, (state, action) => {
        state.questionsList = action.payload;
      })
      .addCase(getQuestionsThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(createQuestionThunk.pending, state => {
        state.errors = [];
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.questionsList.push(action.payload);
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(editQuestionThunk.pending, state => {
        state.errors = [];
      })
      .addCase(editQuestionThunk.fulfilled, (state, action) => {
        const index = state.questionsList.findIndex(
          q => q.id === action.payload.id
        );
        if (index !== -1) {
          state.questionsList[index] = action.payload;
        }
      })
      .addCase(editQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(deleteQuestionThunk.pending, state => {
        state.errors = [];
      })
      .addCase(deleteQuestionThunk.fulfilled, (state, action) => {
        state.questionsList = state.questionsList.filter(
          q => q.id !== action.payload
        );
      })
      .addCase(deleteQuestionThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(createAnswerThunk.pending, state => {
        state.errors = [];
      })
      .addCase(createAnswerThunk.fulfilled, (state, action) => {
        state.answers.push(action.payload);
      })
      .addCase(createAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(editAnswerThunk.pending, state => {
        state.errors = [];
      })
      .addCase(editAnswerThunk.fulfilled, (state, action) => {
        const index = state.answers.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.answers[index] = action.payload;
        }
      })
      .addCase(editAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(deleteAnswerThunk.pending, state => {
        state.errors = [];
      })
      .addCase(deleteAnswerThunk.fulfilled, (state, action) => {
        state.answers = state.answers.filter(a => a.id !== action.payload);
      })
      .addCase(deleteAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
      })
      .addCase(moveAnswerThunk.pending, state => {
        state.errors = [];
      })
      .addCase(moveAnswerThunk.fulfilled, (state, action) => {
        const index = state.answers.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.answers[index] = action.payload;
        }
      })
      .addCase(moveAnswerThunk.rejected, (state, action) => {
        state.errors.push(action.payload as string);
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
