import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Checkbox.module.sass';
import cx from 'classnames';
import { AnswerItem } from '@/store/types';

type CheckboxItems = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  id?: string;
  onAnswerSelect: (
    selectedAnswer: AnswerItem,
    type: string,
    inputNumberValue: number,
    isChecked: boolean,
    questionId: string
  ) => void;
  answer?: AnswerItem;
  questionId: string
};

const Checkbox: FC<CheckboxItems> = ({
  title,
  type,
  name,
  leftCheck,
  id,
  onAnswerSelect,
  answer,
  questionId
}) => {
  const [inputNumberValue, setInputNumberValue] = useState<number | string>('');
  const router = useRouter();
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      setInputNumberValue(e.currentTarget.value);
    }
    questionId &&
      answer &&
      onAnswerSelect(
        answer,
        type,
        Number(inputNumberValue),
        e.currentTarget.checked,
        questionId
      );
  };

  const changeStyleAdminCheckbox = router.pathname === '/signUp';
  const changeType =
    type === 'multiple'
      ? 'checkbox'
      : type === 'single'
      ? 'radio'
      : type === 'number'
      ? 'number'
      : 'checkbox';
  return (
    <div
      className={cx(s.container, {
        [s['admin-container']]: changeStyleAdminCheckbox,
      })}
    >
      {leftCheck && (
        <label
          htmlFor={id}
          className={s.label}
        >
          {title}
        </label>
      )}
      <input
        className={cx(
          s['input'],
          { [s['margin-right']]: title === '' },
          { [s['real-radio']]: type === 'single' },
          { [s['checkbox']]: type === 'multiple' || type === 'checkbox' }
        )}
        type={changeType}
        id={id}
        name={name}
        value={inputNumberValue}
        onChange={onValueChanged}
      />
      {(type === 'multiple' || type.trim() === 'checkbox') && (
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
      {(type === 'single' || type.trim() === 'radio') && (
        <label
          className={s['custom-radio']}
          htmlFor={id}
        />
      )}
      {!leftCheck && title !== '' && type !== 'number' && (
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

export default memo(Checkbox);
