import React, { ChangeEvent, FC, memo } from 'react';
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
};

const Input: FC<InputItems> = ({
  title,
  type,
  name,
  leftCheck,
  setInputValue,
}) => {
  const router = useRouter();
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
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
      {leftCheck && (
        <label
          htmlFor={title}
          className={s.label}
        >
          {title}
        </label>
      )}
      <input
        className={cx(changeStyle, { [s['margin-right']]: title === '' })}
        type={type}
        id={title === 'Select true answer' ? 'myCheckbox' : title}
        name={name}
        onChange={onValueChanged}
      />
      {type === 'checkbox' && (
        <label
          htmlFor={title === 'Select true answer' ? 'myCheckbox' : title}
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
        <label
          className={s['custom-radio']}
          htmlFor={title}
        >
          <input
            className={s['real-radio']}
            type="radio"
            id={title}
            name={name}
          />
        </label>
      )}
      {!leftCheck && title !== '' && (
        <label
          htmlFor={title}
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
