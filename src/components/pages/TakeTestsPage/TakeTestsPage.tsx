import React, { Dispatch, FC, memo, SetStateAction, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';


import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import { removeTest } from '@/store/testReduser';

import { testSelector } from '@/store/selectors';
import { useActionWithPayload } from '@/hooks/useAction';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';

type TakeTestsPageItems = {
  user: string;
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: Dispatch<SetStateAction<string>>;
  editTest: (id: string) => void;
  modalFunctionOnClick: boolean;
};

const TakeTestsPage: FC<TakeTestsPageItems> = ({
  user,
  setModalWindowIsOpen,
  setTitleModalWindow,
  editTest,
  modalFunctionOnClick,
}) => {
  const router = useRouter();

  const allTests = useSelector(testSelector);

  const removeTestAction = useActionWithPayload(removeTest);

  const onClickHandlerDelete = useCallback(
    (id: string) => {
      setTitleModalWindow('Are you sure you want to delete the test?');
      setModalWindowIsOpen();
      if (modalFunctionOnClick) {
        removeTestAction({ id });
      }
    },
    [modalFunctionOnClick, removeTestAction]
  );

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU'); // Форматирует в стиле DD.MM.YYYY
  };

  return (
    <div className={s.container}>

      <h2 className={s.title}> Take Test</h2>
      {allTests.map(test => {
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
                    onClickHandlerDelete(test.id);
                  }}
                />
              )}
              <ChangeButton
                title={'Edit test'}
                onClick={() => {
                  editTest(test.id);
                  router.push(`/${user}/editTest/${test.id}`);
                }}
              />
              <ChangeButton
                title={'Take the Test'}
                onClick={() => {
                  setTitleModalWindow('Start taking the test?');
                  setModalWindowIsOpen();
                }}
              />
              <span className={s['test-date']}>{formatDate(test.date)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(TakeTestsPage);
