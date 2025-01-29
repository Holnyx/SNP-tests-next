import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Input.module.sass';
import cx from 'classnames';

type InputProps = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  setInputValue: (v: string | undefined) => void;
  value?: string;
  id?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  isHidden?: boolean;
};

const Input: FC<InputProps> = ({
  title,
  type,
  name,
  leftCheck,
  setInputValue,
  value,
  id,
  error,
  onKeyDown,
  onChange,
  onBlur,
  autoFocus,
  isHidden,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    setInputValue(e.currentTarget.value);
    if (type === 'checkbox') {
      setIsChecked(e.currentTarget.checked);
    }
  };

  useEffect(() => {
    setErrorMessage('');
    if (
      (!value && error) ||
      (value && value.length < 3 && title.includes('Title'))
    ) {
      setErrorMessage('The title must contain more than 2 characters');
    } else if (
      (value && value.length < 1) ||
      (value === '' && error && title.includes('Answer'))
    ) {
      setErrorMessage('The answer must contain from 1 to 30 characters');
    } else if (
      value &&
      value.length > 30 &&
      (title.includes('Title') || title.includes('Answer'))
    ) {
      setErrorMessage('The answer must not exceed 30 characters');
    }
  }, [value, error, title]);

  const changeStyle =
    type === 'checkbox'
      ? s['checkbox']
      : type === 'radio'
        ? s['radio']
        : s.input;

  const changeStyleAdminCheckbox = router.pathname === '/sign-up';

  return (
    <div
      className={cx(s.container, {
        [s['admin-container']]: changeStyleAdminCheckbox,
        [s['change-title']]: isHidden,
      })}
    >
      {type !== 'radio' && (
        <>
          {leftCheck && (
            <label
              htmlFor={id}
              className={s.label}
            >
              {title}
            </label>
          )}
          <input
            className={cx(changeStyle)}
            type={type}
            id={id}
            name={name}
            checked={isChecked}
            onChange={onValueChanged}
            value={value}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
          />
          {errorMessage && (
            <span className={cx(s['error-message'])}>{errorMessage}</span>
          )}
        </>
      )}

      {type === 'checkbox' && (
        <label
          htmlFor={id}
          className={cx(s['custom-checkbox'], {
            [s['admin-checkbox']]: changeStyleAdminCheckbox,
          })}
        >
          <Image
            src={starUrl}
            alt={'checkbox-icon'}
            priority
            className={cx(s['custom-checkbox-img'])}
          />
        </label>
      )}
      {type === 'radio' && (
        <>
          <input
            className={s['real-radio']}
            type="radio"
            id={id}
            name={name}
          />
          <label
            className={s['custom-radio']}
            htmlFor={id}
          />
        </>
      )}
      {!leftCheck && title !== '' && (
        <label
          htmlFor={id}
          className={cx(s.label, {
            [s['admin-label']]: changeStyleAdminCheckbox,
          })}
        >
          {title}
        </label>
      )}
    </div>
  );
};

export default memo(Input);
