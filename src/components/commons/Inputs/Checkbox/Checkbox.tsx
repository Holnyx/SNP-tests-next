import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import { AnswerItem, OnAnswerSelectArgs } from '@/store/types';

import s from './Checkbox.module.sass';
import cx from 'classnames';

type CheckboxProps = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  id?: string;
  onAnswerSelect?: (args: OnAnswerSelectArgs) => void;
  answer?: AnswerItem;
  questionId: string;
  setIsChecked: (e: boolean) => void;
};

const Checkbox: FC<CheckboxProps> = ({
  title,
  type,
  name,
  leftCheck,
  id,
  onAnswerSelect,
  answer,
  questionId,
  setIsChecked,
}) => {
  const [inputNumberValue, setInputNumberValue] = useState<number | string>('');

  const router = useRouter();

  const onValueChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (type === 'number' && inputNumberValue !== e.currentTarget.value) {
        setInputNumberValue(e.currentTarget.value);
      }
      if (questionId && answer) {
        if (onAnswerSelect) {
          onAnswerSelect({
            selectedAnswer: answer,
            type: type,
            inputNumberValue:
              type === 'number' ? Number(e.currentTarget.value) : 0,
            isChecked: e.currentTarget.checked,
            questionId: questionId,
          });
        }
      }
      setIsChecked(e.currentTarget.checked);
    },
    [type, questionId, answer, setIsChecked, onAnswerSelect]
  );

  const changeStyleAdminCheckbox = router.pathname === '/sign-up';
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
          className={s.label}
          htmlFor={id}
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
        id={id}
        name={name}
        type={changeType}
        value={inputNumberValue}
        onChange={onValueChanged}
      />
      {(type === 'multiple' || type.trim() === 'checkbox') && (
        <label
          className={cx(s['custom-checkbox'], {
            [s['admin-checkbox']]: changeStyleAdminCheckbox,
          })}
          htmlFor={id}
        >
          <Image
            priority
            alt={'checkbox-icon'}
            className={cx(s['custom-checkbox-img'])}
            src={starUrl}
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
          className={cx(s.label, {
            [s['admin-label']]: changeStyleAdminCheckbox,
          })}
          htmlFor={id}
        >
          {title}
        </label>
      )}
    </div>
  );
};

export default memo(Checkbox);
