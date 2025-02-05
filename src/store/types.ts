export type TestsItem = {
  id: string;
  title: string;
  created_at: string | undefined;
  questions: QuestionItem[];
};

export type QuestionItem = {
  id: string;
  title: string | undefined;
  question_type: TestsOptionsForSelect;
  answers: AnswerItem[];
};

export type AnswerItem = {
  id: string;
  text: string;
  name: string | undefined;
  is_right: boolean;
  questionId: string;
  checked?: boolean;
  value?: number;
};

export type TestsState = {
  testsList: TestsItem[];
  questionsList: QuestionItem[];
  searchQuery: string;
  errors: string[];
  sortOrder: FilteredTestsByDate;
  test: null;
  loading: boolean;
  deleteLoading: boolean;
};

export type QuestionState = {
  questionsList: QuestionItem[];
  answers: AnswerItem[];
  errors: string[];
  loading: boolean;
};

export type TestForAdd = {
  testTitle: string;
  testsList: TestsItem[];
  questionList: QuestionItem[];
  answerList: AnswerItem[];
};

export type AnswerForAdd = {
  questionId: string;
  answers: AnswerItem[];
};

export type UserAnswer = {
  questionId: string;
  selectedAnswers: string[];
};

export type FilteredTestsByDate = 'created_at_desc' | 'created_at_asc';

export enum TestsOptionsForSelect {
  None = 'none',
  Single = 'single',
  Multiple = 'multiple',
  Number = 'number',
}

export type OnAnswerSelectArgs = {
  selectedAnswer: AnswerItem;
  type: string;
  inputNumberValue: number;
  isChecked: boolean;
  questionId: string;
};
