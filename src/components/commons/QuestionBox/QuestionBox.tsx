import React, { memo } from 'react';

import s from './QuestionBox.module.sass';
import cx from 'classnames';
import Input from '../Inputs/Input/Input';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';

const QuestionBox = () => {
  return (
    <div className={s['questions-box']}>
      <h3 className={s.title}>What is the capital of ahwbdhwadjhbawbdnawbdhbwadbahwdbjhb France?</h3>
      <ul className={s['answer-list']}>
        <li className={s['option']}>
          <Input
            title={'Berlin'}
            type={'checkbox'}
            name={'Berlin'}
            leftCheck={false}
          />
          <DeleteButton />
        </li>
        <li className={s['option']}>
          <Input
            title={'Madrid'}
            type={'radio'}
            name={'Madrid'}
            leftCheck={false}
          />
          <DeleteButton />
        </li>
        <li className={s['option']}>
          <Input
            title={''}
            type={'number'}
            name={'number'}
            leftCheck={false}
          />
          <DeleteButton />
        </li>
      </ul>
    </div>
  );
};

export default memo(QuestionBox);
