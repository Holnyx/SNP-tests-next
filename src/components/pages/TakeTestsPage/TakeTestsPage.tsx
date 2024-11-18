import React, { Dispatch, FC, memo, SetStateAction } from 'react';
import { useRouter } from 'next/router';

import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';

import { testItemsStateTest } from '@/components/state/testsStateTest';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';

type TakeTestsPageItems = {
  user: string;
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: Dispatch<SetStateAction<string>>;
};

const TakeTestsPage: FC<TakeTestsPageItems> = ({
  user,
  setModalWindowIsOpen,
  setTitleModalWindow,
}) => {
  const router = useRouter();

  return (
    <div className={s.container}>
      <h2 className={s.title}> Take Test</h2>
      {testItemsStateTest.map(test => {
        return (
          <div
            className={s['tests-box']}
            key={test.id}
          >
            <div className={s.test}>
              <span>{test.title}</span>
              {user !== 'user' && (
                <DeleteButton
                  onClick={() => {
                    setTitleModalWindow(
                      'Are you sure you want to delete the test?'
                    );
                    setModalWindowIsOpen();
                  }}
                />
              )}
              <ChangeButton
                title={'Edit test'}
                onClick={() => {
                  router.push(`/${user}/editTest`);
                }}
              />
              <ChangeButton
                title={'Take the Test'}
                onClick={() => {
                  setTitleModalWindow('Start taking the test?');
                  setModalWindowIsOpen();
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TakeTestsPage);
