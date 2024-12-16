import React, { FC, memo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';
import { selectedTestSelector } from '@/store/selectors';

import s from './TestPage.module.sass';
import cx from 'classnames';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';

type TestPageItems = {
  user?: string;
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
                setQuestions={() => {}}
                questionId={''}
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
      <ModalWindow
        isModalWindowOpen={false}
        setIsModalWindowOpen={() => {}}
        onConfirm={() => setTakeTest(true)}
        title={''}
      />
    </div>
  );
};

export default memo(TestPage);
