import { createSelector } from 'reselect';
import { AppRootStateItems } from '.';
import { AnswerItem, QuestionItem } from './types';

const testsSelector = (state: AppRootStateItems) => state.tests.testsList;
const loadingsSelector = (state: AppRootStateItems) => state.tests.loading;
const deleteLoadingsSelector = (state: AppRootStateItems) => state.tests.deleteLoading;
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
export const loadingSelector = createSelector(loadingsSelector, state => state);
export const deleteLoadingSelector = createSelector(deleteLoadingsSelector, state => state);
export const filterSelector = createSelector(sortOrderSelector, state => state);

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
