import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';

import arrowIcon from '/public/img/arrow-down.svg?url';
import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';

import { removeTest } from '@/store/testReduser';
import { TestsItem } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';
import { setCookie } from 'cookies-next';

type TakeTestsPageItems = {
  user: string;
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: Dispatch<SetStateAction<string>>;
  editTest: (id: string) => void;
  modalFunctionOnClick: boolean;
  search: string;
  isSearching: boolean;
  results: TestsItem[];
};

const TakeTestsPage: FC<TakeTestsPageItems> = ({
  user,
  setModalWindowIsOpen,
  setTitleModalWindow,
  editTest,
  modalFunctionOnClick,
  search,
  isSearching,
  results,
}) => {
  const [show, setShow] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');
  const router = useRouter();
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
    return date.toLocaleDateString('ru-RU');
  };

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
                      onClickHandlerDelete(test.id);
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
                    setTitleModalWindow('Start taking the test?');
                    setModalWindowIsOpen();
                  }}
                />
                <span className={s['test-date']}>{formatDate(test.date)}</span>
                <Image
                  src={arrowIcon}
                  alt={'arrow'}
                  className={cx(s['arrow-icon'], { [s.show]: show })}
                  onClick={() => {
                    setShow(prevValue => !prevValue);
                    setSelectedTestId(test.id);
                  }}
                />
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
    </div>
  );
};

export default memo(TakeTestsPage);
