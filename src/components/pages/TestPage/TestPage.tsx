import React, { FC, memo, useState } from 'react';
import { useRouter } from 'next/router';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import { testItemsStateTest } from '@/components/state/testsStateTest';

import s from './TestPage.module.sass';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { selectedTestSelector } from '@/store/selectors';

type TestPageItems = {
  user: string;
  id?: string;
};

const TestPage: FC<TestPageItems> = ({ user, id }) => {
  const [takeTest, setTakeTest] = useState(false);

  const router = useRouter();
  const selectedTest = useSelector(state => selectedTestSelector(state, id));

  return (
    <div className={s.container}>
      {selectedTest &&
        selectedTest.questions.map(test => {
          return (
            <div key={test.id}>
              <h2 className={s.title}>{test.title}</h2>
              <QuestionBox
                question={test}
                takeTest={takeTest}
                testId={''}
                setQuestions={() => {}}
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
