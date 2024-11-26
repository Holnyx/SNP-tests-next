export type TestsItem = {
  id: string;
  title: string;
  date: string;
  questions: QuestionItem[];
};

export type QuestionItem = {
  id: string;
  title: string;
  questionType: TestsOptionsForSelect;
  answer: AnswerItem[];
};

export type AnswerItem = {
  id: string;
  title: string;
  name: string;
  isTrue: boolean;
};

export type TestsState = {
  testsList: TestsItem[];
  searchQuery: string;
  errors: string[];
};

export type TestsOptionsForSelect = 'none' | 'radio' | 'checkbox' | 'number';
