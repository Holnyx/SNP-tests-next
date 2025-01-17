import { createSelector } from 'reselect';
import { AppRootStateItems } from '.';
import { AnswerItem, QuestionItem, TestsItem } from './types';

const testsSelector = (state: AppRootStateItems) => state.tests.testsList;

const questionsSelector = (state: AppRootStateItems) => state.questions;
const errorsSelector = (state: AppRootStateItems) => state.tests.errors;
const authErrorsSelector = (state: AppRootStateItems) => state.auth.errors;
const sortOrderSelector = (state: AppRootStateItems) => state.tests.sortOrder;

export const testSelector = createSelector(testsSelector, state => state);
export const questionSelector = createSelector(
  questionsSelector,
  state => state
);
export const answerSelector = createSelector(questionsSelector, questions => {
  return questions.questionsList.reduce(
    (allAnswers: AnswerItem[], question: QuestionItem) => {
      return [...allAnswers, ...question.answers];
    },
    []
  );
});
export const errorSelector = createSelector(errorsSelector, state => state);
export const authErrorSelector = createSelector(
  authErrorsSelector,
  state => state
);
export const filterSelector = createSelector(sortOrderSelector, state => state);

export const selectedTestSelector = createSelector(
  [testSelector, (state, selectedTestId) => selectedTestId],
  (allTests, selectedTestId) => {
    return [...allTests].find(
      (test: TestsItem) => String(test.id) === String(selectedTestId)
    );
  }
);

export const selectedQuestionSelector = createSelector(
  [questionSelector, (state, selectedQuestionId) => selectedQuestionId],
  (allQuestions, selectedQuestionId) => {
    return allQuestions.questionsList.find(
      (question: QuestionItem) =>
        String(question.id) === String(selectedQuestionId)
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
    return [...testsList].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }
);
