import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import arrowIcon from '/public/img/arrow-down.svg?url';
import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import Loader from '@/components/commons/Loader/Loader';

import { AppDispatch } from '@/store';
import { TestsItem } from '@/store/types';
import { deleteTestThunk, getAllTestsThunk } from '@/thunk/testsThunk';
import { deleteLoadingSelector, loadingSelector } from '@/store/selectors';
import { useDebounce } from '@/hooks/useDebounce';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';

type TakeTestsPageItems = {
  user?: string;
  editTest: (id: string) => void;
  search: string;
  isSearching: boolean;
  results: TestsItem[];
  searchTerm: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pathRouteTestsList: boolean
};

const TakeTestsPage: FC<TakeTestsPageItems> = ({
  user,
  editTest,
  isSearching,
  results,
  searchTerm,
  setCurrentPage,
  currentPage,
  pathRouteTestsList
}) => {
  const [show, setShow] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [isModalWindowTitle, setIsModalWindowTitle] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(loadingSelector);
  const deleteLoading = useSelector(deleteLoadingSelector);
  const debouncedSearchValue = useDebounce(searchTerm, 500);

  const onClickHandlerDeleteTest = useCallback(() => {
    setIsModalWindowTitle('Are you sure you want to delete the test?');
    setIsModalWindowOpen(true);
  }, [setIsModalWindowTitle]);

  const onConfirm = useCallback(async () => {
    if (isModalWindowTitle.includes('delete')) {
      await dispatch(deleteTestThunk(selectedTestId));
      const response = await dispatch(
        getAllTestsThunk({
          page: currentPage,
          per: 5,
          search: debouncedSearchValue,
          sort: 'created_at_desc',
        })
      );
      if (response.payload?.meta?.total_pages) {
        setTotalPages(response.payload.meta.total_pages);
      }
    } else if (isModalWindowTitle.includes('taking')) {
      router.replace(`/${user}/test-page/${selectedTestId}`);
    }
  }, [isModalWindowTitle, dispatch, selectedTestId, currentPage, router, user]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('ru-RU');
  };

  const loadMoreTests = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      dispatch(
        getAllTestsThunk({
          page: currentPage + 1,
          per: 5,
          search: debouncedSearchValue,
          sort: 'created_at_desc',
        })
      );
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  useEffect(() => {
    const fetchTests = async () => {
      const response = await dispatch(
        getAllTestsThunk({
          page: currentPage,
          per: 5,
          search: debouncedSearchValue,
          sort: 'created_at_desc',
        })
      );
      if (response.payload?.meta?.total_pages) {
        setTotalPages(response.payload.meta.total_pages);
      }
    };

    fetchTests();
  }, [currentPage, dispatch, debouncedSearchValue]);

  return (
    <div className={s.container}>
      <h2 className={s.title}> Take Test</h2>
      {loading && (
        <>
          <Loader />
        </>
      )}
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
                {router.pathname !== '/user/take-tests' && (
                  <ChangeButton
                    title={'Edit test'}
                    onClick={() => {
                      editTest(test.id);
                      router.replace(`/${user}/edit-test/${test.id}`);
                    }}
                  />
                )}

                <ChangeButton
                  title={'Take the Test'}
                  onClick={() => {
                    setSelectedTestId(test.id);
                    setIsModalWindowTitle('Start taking the test?');
                    setIsModalWindowOpen(true);
                  }}
                />
                <span className={s['test-date']}>
                  {formatDate(test.created_at)}
                </span>
                {pathRouteTestsList && (
                  <Image
                    src={arrowIcon}
                    alt={'arrow'}
                    className={cx(s['arrow-icon'], { [s.show]: show })}
                    onClick={() => {
                      setShow(prevValue => !prevValue);
                      setSelectedTestId(test.id);
                    }}
                    title="Show questions"
                  />
                )}
                {deleteLoading && selectedTestId === test.id && (
                  <>
                    <Loader />
                  </>
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
      {totalPages > 1 && (
        <div className={s.pages}>
          <ChangeButton
            title={'Previous'}
            onClick={prevPage}
            disabled={currentPage === 1}
          />
          <span>Page {currentPage}</span>
          <ChangeButton
            title={'Next'}
            onClick={loadMoreTests}
            disabled={currentPage >= totalPages}
          />
        </div>
      )}
      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        onClose={() => setIsModalWindowOpen(false)}
        onConfirm={onConfirm}
        title={isModalWindowTitle}
      />
    </div>
  );
};

export default memo(TakeTestsPage);
