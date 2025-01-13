export type TestsItem = {
  id: string;
  title: string;
  created_at: string;
  questions: QuestionItem[];
};

export type QuestionItem = {
  id: string;
  title: string;
  question_type: TestsOptionsForSelect;
  answer: AnswerItem[];
};

export type AnswerItem = {
  id: string;
  title: string;
  name: string;
  is_right: boolean;
  questionId: string;
};

export type TestsState = {
  testsList: TestsItem[];
  searchQuery: string;
  errors: string[];
  sortOrder: FilteredTestsByDate;
  test: null;
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

export type FilteredTestsByDate = 'desc' | 'asc';
export type TestsOptionsForSelect = 'none' | 'single' | 'multiple' | 'number';
