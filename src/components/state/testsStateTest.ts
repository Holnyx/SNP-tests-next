import { TestsItem } from '@/store/types';

export const testItemsStateTest: TestsItem[] = [
  {
    id: '1',
    title: 'Test Name for test',
    questions: [
      {
        id: '12',
        title: 'Question for test',
        questionType: 'radio',
        answer: [
          {
            id: '33',
            title: 'First',
            name: 'Question for test',
            isTrue: false,
          },
          {
            id: '34',
            title: 'Second',
            name: 'Question for test',
            isTrue: false,
          },
          {
            id: '35',
            title: 'Thirty',
            name: 'Question for test',
            isTrue: true,
          },
        ],
      },
    ],
  },
];
