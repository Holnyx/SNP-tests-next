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
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
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
            className={cx(changeStyle, { [s['margin-right']]: title === '' })}
            type={type}
            id={id}
            name={name}
            checked={isChecked}
            onChange={onValueChanged}
            value={value}
          />
          {value && value.length < 3 || value === '' && error && title.includes('Title') ? (
            <span className={cx(s['error-message'])}>
              The title must contain more than three character
            </span>
          ) : value && value.length < 1 || value === ''   && error && title.includes('Answer') ? (
            <span className={cx(s['error-message'])}>
              The answer must contain from 1 to 19 characters
            </span>
          ) : value && value.length > 19 && title.includes('Title') ? (
            <span className={cx(s['error-message'])}>
              The answer must not exceed 19 characters
            </span>
          ) : value && value.length > 19 && title.includes('Answer') ? (
            <span className={cx(s['error-message'])}>
              The answer must not exceed 19 characters
            </span>
          ): (
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
