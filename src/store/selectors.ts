import { createSelector } from 'reselect';

import { AnswerItem, QuestionItem } from './types';

import { AppRootStateItems } from '.';

const sortOrderSelector = (state: AppRootStateItems) => state.tests.sortOrder;

export const testSelector = createSelector(
  (state: AppRootStateItems) => state.tests.testsList,
  state => state
);
export const questionSelector = createSelector(
  (state: AppRootStateItems) => state.questions,
  state => state
);
export const answerSelector = createSelector(
  (state: AppRootStateItems) => state.questions,
  questions => {
    return questions.questionsList.reduce(
      (allAnswers: AnswerItem[], question: QuestionItem) => {
        return [...allAnswers, ...question.answers];
      },
      []
    );
  }
);
export const errorSelector = createSelector(
  (state: AppRootStateItems) => state.tests.errors,
  state => state
);
export const authErrorSelector = createSelector(
  (state: AppRootStateItems) => state.auth.errors,
  state => state
);
export const loadingSelector = createSelector(
  (state: AppRootStateItems) => state.tests.loading,
  state => state
);
export const deleteLoadingSelector = createSelector(
  (state: AppRootStateItems) => state.tests.deleteLoading,
  state => state
);
export const filterSelector = createSelector(sortOrderSelector, state => state);

export const sortedTestsSelector = createSelector(
  [testSelector, sortOrderSelector],
  (testsList, sortOrder) => {
    return [...testsList].sort((a, b) => {
      const dateA = new Date(String(a.created_at));
      const dateB = new Date(String(b.created_at));
      return sortOrder === 'created_at_asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    });
  }
);
