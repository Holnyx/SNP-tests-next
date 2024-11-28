import { createSelector } from 'reselect';
import { AppRootStateItems } from '.';
import { AnswerItem, QuestionItem, TestsItem } from './types';

const testsSelector = (state: AppRootStateItems) => state.tests.testsList;
const questionsSelector = (state: AppRootStateItems) => state.questions;
// const answersSelector = (state: AppRootStateItems) => state.answers;
const sortOrderSelector = (state: AppRootStateItems) => state.tests.sortOrder;

export const testSelector = createSelector(testsSelector, state => state);
export const questionSelector = createSelector(
  questionsSelector,
  state => state
);
export const answerSelector = createSelector(questionsSelector, state => state);
export const filterSelector = createSelector(sortOrderSelector, state => state);
export const errorSelector = createSelector(testSelector, state => state);

export const selectedTestSelector = createSelector(
  [testSelector, (state, selectedTestId) => selectedTestId],
  (allTests, selectedTestId) => {
    return allTests.find((test: TestsItem) => test.id === selectedTestId);
  }
);

export const selectedQuestionSelector = createSelector(
  [questionSelector, (state, selectedQuestionId) => selectedQuestionId],
  (allQuestions, selectedQuestionId) => {
    return allQuestions.find(
      (question: QuestionItem) => question.id === selectedQuestionId
    );
  }
);

// export const selectedAnswerSelector = createSelector(
//   [answersSelector, (state, selectedAnswerId) => selectedAnswerId],
//   (allAnswers, selectedAnswerId) => {
//     return allAnswers.find(
//       (answer: AnswerItem) => answer.id === selectedAnswerId
//     );
//   }
// );

export const sortedTestsSelector = createSelector(
  [testSelector, sortOrderSelector],
  (testsList, sortOrder) => {
    console.log('Original testsList:', testsList);
    console.log('Sort order:', sortOrder);

    return [...testsList].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }
);
