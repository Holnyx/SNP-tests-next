import React, { ChangeEvent, FC, memo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Input.module.sass';
import cx from 'classnames';

type InputItems = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  value?: string;
  id?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  isHidden?: boolean;
};

const Input: FC<InputItems> = ({
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
  const changeStyle =
    type === 'checkbox'
      ? s['checkbox']
      : type === 'radio'
      ? s['radio']
      : s.input;

  const changeStyleAdminCheckbox = router.pathname === '/signUp';

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
          {(value && value.length < 1) ||
          (value === '' && error && title.includes('Title')) ? (
            <span className={cx(s['error-message'])}>
              The title must contain more than 1 character
            </span>
          ) : (value && value.length < 1) ||
            (value === '' && error && title.includes('Answer')) ? (
            <span className={cx(s['error-message'])}>
              The answer must contain from 1 to 30 characters
            </span>
          ) : value && value.length > 30 && title.includes('Title') ? (
            <span className={cx(s['error-message'])}>
              The answer must not exceed 30 characters
            </span>
          ) : value && value.length > 30 && title.includes('Answer') ? (
            <span className={cx(s['error-message'])}>
              The answer must not exceed 30 characters
            </span>
          ) : (
            ''
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
