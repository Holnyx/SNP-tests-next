import React, { ChangeEvent, FC, memo } from 'react';

import s from './InputForLogIn.module.sass';
import cx from 'classnames';

type InputForLogInItems = {
  getTitle: string;
  getType: string;
  getName: string;
  value?: string;
  id?: string;
  error?: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputPasswordValue?: string;
};

const InputForLogIn: FC<InputForLogInItems> = ({
  getTitle,
  getType,
  getName,
  value,
  id,
  setInputValue,
  error,
  inputPasswordValue,
}) => {
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };
  return (
    <div className={s.container}>
      <label
        className={s.label}
        htmlFor={getName}
      >
        {getTitle}
      </label>
      <input
        className={s.input}
        type={getType}
        name={getName}
        id={id}
        value={value}
        onChange={onValueChanged}
      />
      {value === '' && error && getName.includes('name') ? (
        <span className={cx(s['error-message'])}>
          The name must contain from 3 to 19 characters
        </span>
      ) : value && value.length > 19 && getName.includes('name') ? (
        <span className={cx(s['error-message'])}>
          The name must not exceed 19 characters
        </span>
      ) : value && value.length < 3 && getName.includes('name') ? (
        <span className={cx(s['error-message'])}>
          The name must contain at least 3 characters
        </span>
      ) : value === '' && error && getTitle === 'Password' ? (
        <span className={cx(s['error-message'])}>
          The password must contain more than five character
        </span>
      ) : value && value.length < 5 && error && getTitle === 'Password' ? (
        <span className={cx(s['error-message'])}>
          The password must contain more than five character
        </span>
      ) : value === '' && error && getName.includes('confirmation') ? (
        <span className={cx(s['error-message'])}>Passwords do not match</span>
      ) : value !== inputPasswordValue && error && getName.includes('confirmation') ? (
        <span className={cx(s['error-message'])}>Passwords do not match</span>
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(InputForLogIn);
