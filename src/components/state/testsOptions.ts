export type TestsOptionsItem = {
  value: string;
  title: string;
  disabled?: boolean;
};

export const testsOptions: TestsOptionsItem[] = [
  { value: 'none', title: 'Select question type', disabled: true },
  { value: 'radio', title: 'One from the list' },
  { value: 'checkbox', title: 'Several from the list' },
  { value: 'number', title: 'Numerical answer' },
];
