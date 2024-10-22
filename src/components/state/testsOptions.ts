export type TestsOptionsItem = {
  value: string;
  title: string;
  disabled?: boolean;
};

export const testsOptions: TestsOptionsItem[] = [
  { value: 'disabled', title: 'Select question type', disabled: true },
  { value: 'one', title: 'One from the list' },
  { value: 'some', title: 'Several from the list' },
  { value: 'number', title: 'Numerical answer' },
];
