import { createSelector } from 'reselect';
import { AppRootStateItems } from '.';
import { AnswerItem, QuestionItem, TestsItem } from './types';

const questionsSelector = (state: AppRootStateItems) => state.questions;
const testsSelector = (state: AppRootStateItems) => state.tests;
const answersSelector = (state: AppRootStateItems) => state.answers;

export const answerSelector = createSelector(questionsSelector, state => [
  ...state,
]);

export const questionSelector = createSelector(questionsSelector, state => [
  ...state,
]);
export const testSelector = createSelector(testsSelector, state => [
  ...state.testsList,
]);
// export const searchQuerySelector = createSelector(
//   rootSelector,
//   state => state.tests
// );

export const errorSelector = createSelector(testSelector, state => state);

export const selectedTestSelector = createSelector(
  [testSelector, (state, selectedTestId) => selectedTestId],
  (allTests, selectedTestId) => {
    return allTests.find((test: TestsItem) => test.id === selectedTestId);
  }
);

export const selectedQuestionSelector = createSelector(
  [answersSelector, (state, selectedAnswerId) => selectedAnswerId],
  (allAnswers, selectedAnswerId) => {
    return allAnswers.find(
      (answer: AnswerItem) => answer.id === selectedAnswerId
    );
  }
);

export const selectedAnswerSelector = createSelector(
  [questionSelector, (state, selectedQuestionId) => selectedQuestionId],
  (allQuestions, selectedQuestionId) => {
    return allQuestions.find(
      (question: QuestionItem) => question.id === selectedQuestionId
    );
  }
);
