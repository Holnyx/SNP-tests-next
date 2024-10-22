import React, { memo } from 'react';

import s from './TestPage.module.sass';
import cx from 'classnames';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import Input from '@/components/commons/Inputs/Input/Input';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

const TestPage = () => {
  return (
    <div className={s.container}>
      <h2 className={s.title}> Test Title</h2>
        <QuestionBox />
      <div className={s['buttons-box']}>
        {' '}
        <ChangeButton
          title={'Go Back'}
          onClick={() => {}}
        />
        <ChangeButton
          title={'Go Forward'}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default memo(TestPage);
