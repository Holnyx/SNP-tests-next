import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';

import s from './InputForLogIn.module.sass';
import cx from 'classnames';

type InputForLogInProps = {
  title: string;
  type: string;
  name: string;
  value?: string;
  id?: string;
  error?: boolean;
  setInputValue: (v: string) => void;
  url: string;
};

const InputForLogIn: FC<InputForLogInProps> = ({
  title,
  type,
  name,
  value,
  id,
  setInputValue,
  error,
  url,
}) => {
  const [errorMessage, setErrorMessage] = useState('');

  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  useEffect(() => {
    setErrorMessage('');
    if (url !== 'sign-in') {
      if (name.includes('name')) {
        if (!value && error) {
          setErrorMessage('The name must contain from 3 to 19 characters');
        } else if (value && value.length > 19) {
          setErrorMessage('The name must not exceed 19 characters');
        } else if (value && value.length < 3) {
          setErrorMessage('The name must contain at least 3 characters');
        }
      }
      if (title === 'Password' && (!value || value.length <= 5) && error) {
        setErrorMessage('The password must contain more than five characters');
      }
    }
  }, [value, error, name, title, url]);

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
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onValueChanged}
      />
      {errorMessage ? (
        <span className={cx(s['error-message'])}>{errorMessage}</span>
      ) : null}
    </div>
  );
};

export default memo(InputForLogIn);
