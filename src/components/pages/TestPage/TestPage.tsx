import React, { FC, memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import { testItemsStateTest } from '@/components/state/testsStateTest';

import s from './TestPage.module.sass';
import cx from 'classnames';

type TestPageItems = {
  user: string;
};

const TestPage: FC<TestPageItems> = ({ user }) => {
  const [takeTest, setTakeTest] = useState(false);
  const router = useRouter();

  return (
    <div className={s.container}>
      {testItemsStateTest.map(test => {
        return (
          <div key={test.id}>
            <h2 className={s.title}>{test.title}</h2>
            <QuestionBox
              question={test.questions}
              takeTest={takeTest}
            />
          </div>
        );
      })}

      <div className={s['buttons-box']}>
        <ChangeButton
          title={'Go Back'}
          onClick={() => {
            router.push(`/${user}/takeTests`);
          }}
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
