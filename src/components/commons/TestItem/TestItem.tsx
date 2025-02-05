import React, { FC, memo, useCallback, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import arrowIcon from '/public/img/arrow-down.svg?url';

import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import Loader from '../Loader/Loader';

import { TestsItem } from '@/store/types';

import s from './TestItem.module.sass';
import cx from 'classnames';

type TestItemProps = {
  test: TestsItem;
  user?: string;
  editTest: (id: string) => void;
  pathRouteTestsList: boolean;
  role: boolean;
  onClickHandlerDeleteTest: (id: string) => void;
  deleteLoading: boolean;
  selectedTestId: string;
  handleTakeTest: (testId: string) => void;
};

const TestItem: FC<TestItemProps> = ({
  test,
  user,
  editTest,
  pathRouteTestsList,
  role,
  onClickHandlerDeleteTest,
  deleteLoading,
  selectedTestId,
  handleTakeTest,
}) => {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handlerTakeTest = useCallback(() => {
    handleTakeTest(test.id);
  }, [handleTakeTest, test.id]);

  const handlerDelete = useCallback(() => {
    onClickHandlerDeleteTest(test.id);
  }, [onClickHandlerDeleteTest, test.id]);

  const handlerEdit = useCallback(() => {
    editTest(test.id);
    router.replace(`/${user}/edit-test/${test.id}`);
  }, [editTest, router, test.id, user]);

  const handlerToggleQuestions = useCallback(() => {
    setShow(prev => !prev);
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className={s['tests-box']}>
      <div className={s.test}>
        <span>{test.title}</span>
        {user !== 'user' && <DeleteButton onClick={handlerDelete} />}
        {router.pathname !== '/user/take-tests' && (
          <ChangeButton
            title={'Edit test'}
            onClick={handlerEdit}
          />
        )}
        <ChangeButton
          title={'Take the Test'}
          onClick={handlerTakeTest}
        />
        <span className={s['test-date']}>
          {formatDate(String(test.created_at))}
        </span>
        {pathRouteTestsList && role && (
          <Image
            alt={'arrow'}
            className={cx(s['arrow-icon'], { [s.show]: show })}
            src={arrowIcon}
            title="Show questions"
            onClick={handlerToggleQuestions}
          />
        )}
        {deleteLoading && selectedTestId === test.id && <Loader />}
      </div>
      {show && (
        <div className={s['questions-list']}>
          {test.questions.map(el => (
            <div key={el.id}>{el.title}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(TestItem);
