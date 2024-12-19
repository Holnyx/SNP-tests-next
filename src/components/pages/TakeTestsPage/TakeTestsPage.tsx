import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDispatch } from 'react-redux';

import arrowIcon from '/public/img/arrow-down.svg?url';
import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';

import { TestsItem } from '@/store/types';
import { deleteTestThunk } from '@/thunk/testsThunk';
import { AppDispatch } from '@/store';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';

type TakeTestsPageItems = {
  user?: string;
  editTest: (id: string) => void;
  search: string;
  isSearching: boolean;
  results: TestsItem[];
};

const TakeTestsPage: FC<TakeTestsPageItems> = ({
  user,
  editTest,
  search,
  isSearching,
  results,
}) => {
  const [show, setShow] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');

  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [isModalWindowTitle, setIsModalWindowTitle] = useState('');

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const onClickHandlerDeleteTest = useCallback(() => {
    setIsModalWindowTitle('Are you sure you want to delete the test?');
    setIsModalWindowOpen(true);
  }, [setIsModalWindowTitle]);

  const onConfirm = useCallback(() => {
    if (isModalWindowTitle.includes('taking')) {
    } else if (isModalWindowTitle.includes('delete')) {
      dispatch(deleteTestThunk(selectedTestId));
    }
  }, [isModalWindowTitle, dispatch, selectedTestId]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU');
  };

  const pathRouteTakeTests = router.pathname === '/admin/takeTests';

  return (
    <div className={s.container}>
      <h2 className={s.title}> Take Test</h2>
      {isSearching && <div>Searching ...</div>}
      {!isSearching &&
        results.map(test => {
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
                      setSelectedTestId(test.id);
                      onClickHandlerDeleteTest();
                    }}
                  />
                )}
                {router.pathname !== '/user/takeTests' && (
                  <ChangeButton
                    title={'Edit test'}
                    onClick={() => {
                      editTest(test.id);
                      router.push(`/${user}/editTest/${test.id}`);
                    }}
                  />
                )}

                <ChangeButton
                  title={'Take the Test'}
                  onClick={() => {
                    setIsModalWindowTitle('Start taking the test?');
                    setIsModalWindowOpen(true);
                  }}
                />
                <span className={s['test-date']}>
                  {formatDate(test.created_at)}
                </span>
                {pathRouteTakeTests && (
                  <Image
                    src={arrowIcon}
                    alt={'arrow'}
                    className={cx(s['arrow-icon'], { [s.show]: show })}
                    onClick={() => {
                      setShow(prevValue => !prevValue);
                      setSelectedTestId(test.id);
                    }}
                    title="Show answers"
                  />
                )}
              </div>
              {show && (
                <div className={s['questions-list']}>
                  {test.questions.map(
                    el =>
                      selectedTestId === test.id && (
                        <div key={el.id}>{el.title}</div>
                      )
                  )}
                </div>
              )}
            </div>
          );
        })}
      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        setIsModalWindowOpen={setIsModalWindowOpen}
        onConfirm={onConfirm}
        title={isModalWindowTitle}
      />
    </div>
  );
};

export default memo(TakeTestsPage);
