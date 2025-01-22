import React, { ChangeEvent, FC, memo } from 'react';

import s from './InputForLogIn.module.sass';
import cx from 'classnames';

type InputForLogInItems = {
  title: string;
  type: string;
  name: string;
  value?: string;
  id?: string;
  error?: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  inputPasswordValue?: string;
  url: string;
};

const InputForLogIn: FC<InputForLogInItems> = ({
  title,
  type,
  name,
  value,
  id,
  setInputValue,
  error,
  inputPasswordValue,
  url,
}) => {
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };
  return (
    <div className={s.container}>
      <label
        className={s.label}
        htmlFor={name}
      >
        {title}
      </label>
      <input
        className={s.input}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onValueChanged}
      />
      {value === '' && error && name.includes('name') && url !== 'sign-in' ? (
        <span className={cx(s['error-message'])}>
          The name must contain from 3 to 19 characters
        </span>
      ) : value &&
        value.length > 19 &&
        name.includes('name') &&
        url !== 'sign-in' ? (
        <span className={cx(s['error-message'])}>
          The name must not exceed 19 characters
        </span>
      ) : value &&
        value.length < 3 &&
        name.includes('name') &&
        url !== 'sign-in' ? (
        <span className={cx(s['error-message'])}>
          The name must contain at least 3 characters
        </span>
      ) : value === '' && error && title === 'Password' && url !== 'sign-in' ? (
        <span className={cx(s['error-message'])}>
          The password must contain more than five character
        </span>
      ) : value &&
        value.length <= 5 &&
        error &&
        title === 'Password' &&
        url !== 'sign-in' ? (
        <span className={cx(s['error-message'])}>
          The password must contain more than five character
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(InputForLogIn);
