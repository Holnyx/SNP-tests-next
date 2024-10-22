import React, { ChangeEvent, FC, memo, useState } from 'react';
import { TestsOptionsItem } from '@/components/state/testsOptions';

import s from './SelectField.module.sass';
import cx from 'classnames';

type SelectFieldPropsItem = {
  title?: string;
  htmlFor?: string;
  defaultValue: string;
  required?: boolean;
  name?: string;
  id?: string;
  directionOptions: TestsOptionsItem[];
  setSelect: React.Dispatch<React.SetStateAction<string>>;
};

const SelectField: FC<SelectFieldPropsItem> = ({
  title,
  htmlFor,
  defaultValue,
  required,
  name,
  id,
  directionOptions,
  setSelect,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelect(event.currentTarget.value);
  };

  const isPlaceholder = directionOptions.some(
    el => el.value === defaultValue && el.disabled
  );

  return (
    <div className={s['input-box']}>
      <label htmlFor={htmlFor}>{title}</label>
      <select
        defaultValue={defaultValue}
        required={required}
        className={cx(s['input-style'], {
          [s['select-placeholder']]: !isPlaceholder,
        })}
        name={name}
        id={id}
        onChange={handleChange}
      >
        {directionOptions.map((option, i) => (
          <option
            key={i}
            value={option.value}
            disabled={option.disabled}
          >
            {option.title}
          </option>
        ))}
      </select>
      {/* <Icon iconId={'ic-dropdown'} className='ic-dropdown' viewBox='0 0 26 26' width='26' height='26' /> */}
    </div>
  );
};
export default memo(SelectField);
