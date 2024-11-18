import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnswerItem } from './types';
import { useSelector } from 'react-redux';
import { selectedAnswerSelector } from './selectors';

const initialState: AnswerItem[] = [];

const answersSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    addAnswer(
      state,
      action: PayloadAction<{ questionId: string; answer: AnswerItem }>
    ) {
      const selectedQuestion = useSelector(state =>
        selectedAnswerSelector(state, action.payload.questionId)
      );
      console.log(selectedQuestion);
      
      if (selectedQuestion) {
        const question = state.find(
          element => element.id === action.payload.questionId
        );

        if (question) {
          state.unshift(action.payload.answer);
        }
      }
    },
    removeAnswer(
      state,
      action: PayloadAction<{ questionId: string; answerId: string }>
    ) {
      //   const question = state.find(
      //     element => element.id === action.payload.questionId
      //   );
      //   if (question) {
      //     question.answer = question.answer.filter(
      //       element => element.id !== action.payload.answerId
      //     );
      //   }
      return state.filter(element => element.id !== action.payload.answerId);
    },
  },
});

export const { addAnswer, removeAnswer } = answersSlice.actions;

export default answersSlice.reducer;
