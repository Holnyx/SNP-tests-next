import React, { FC, memo } from 'react';
import Image from 'next/image';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Input.module.sass';
import cx from 'classnames';

type InputItems = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
};

const Input: FC<InputItems> = ({ title, type, name, leftCheck }) => {
  const changeStyle =
    type === 'checkbox'
      ? s['checkbox']
      : type === 'radio'
      ? s['radio']
      : s.input;

  return (
    <div className={s.container}>
      {leftCheck && (
        <label
          htmlFor={name}
          className={s.label}
        >
          {title}
        </label>
      )}
      <input
        className={cx(changeStyle, {[s['margin-right']]: title === ''})}
        type={type}
        id={title === 'Select true answer' ? 'myCheckbox' : name}
      />
      {type === 'checkbox' && (
        <label
          htmlFor={title === 'Select true answer' ? 'myCheckbox' : name}
          className={s['custom-checkbox']}
        >
          <Image
            src={starUrl}
            alt={'checkbox-icon'}
            priority
            className={s['custom-checkbox-img']}
          />
        </label>
      )}
      {type === 'radio' && (
        <label
          className={s['custom-radio']}
          htmlFor={name}
        >
          <input
            className={s['real-radio']}
            type="radio"
            id={name}
            name={name}
          />
        </label>
      )}
      {!leftCheck && title !== '' && (
        <label
          htmlFor={name}
          className={s.label}
        >
          {title}
        </label>
      )}
    </div>
  );
};

export default memo(Input);
