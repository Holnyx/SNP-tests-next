import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import Loader from '@/components/commons/Loader/Loader';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import TestItem from '@/components/commons/TestItem/TestItem';

import { useDebounce } from '@/hooks/useDebounce';
import { useModal } from '@/hooks/useModal';
import { AppDispatch } from '@/store';
import {
  deleteLoadingSelector,
  filterSelector,
  loadingSelector,
} from '@/store/selectors';
import { TestsItem } from '@/store/types';
import { deleteTestThunk, getAllTestsThunk } from '@/thunk/testsThunk';

import s from './TakeTestsPage.module.sass';

type TakeTestsPageProps = {
  user?: string;
  editTest: (id: string) => void;
  search: string;
  isSearching: boolean;
  results: TestsItem[];
  searchTerm: string;
  setCurrentPage: (v: number) => void;
  currentPage: number;
  pathRouteTestsList: boolean;
  role: boolean;
};

const TakeTestsPage: FC<TakeTestsPageProps> = ({
  user,
  editTest,
  isSearching,
  results,
  searchTerm,
  setCurrentPage,
  currentPage,
  pathRouteTestsList,
  role,
}) => {
  const [selectedTestId, setSelectedTestId] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const { isModalOpen, modalTitle, openModal, closeModal } = useModal();

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const filterAction = useSelector(filterSelector);
  const loading = useSelector(loadingSelector);
  const deleteLoading = useSelector(deleteLoadingSelector);
  const debouncedSearchValue = useDebounce(searchTerm, 500);

  const onClickHandlerDeleteTest = useCallback(
    (testId: string) => {
      setSelectedTestId(testId);
      openModal('Are you sure you want to delete the test?');
    },
    [openModal]
  );

  const handleTakeTest = useCallback(
    (testId: string) => {
      setSelectedTestId(testId);
      openModal('Start taking the test?');
    },
    [openModal]
  );

  const onConfirm = useCallback(async () => {
    if (modalTitle.includes('delete')) {
      await dispatch(deleteTestThunk(selectedTestId));
      const response = await dispatch(
        getAllTestsThunk({
          page: currentPage,
          per: 5,
          search: debouncedSearchValue,
          sort: filterAction,
        })
      );
      if (response.payload?.meta?.total_pages) {
        setTotalPages(response.payload.meta.total_pages);
      }
    } else if (modalTitle.includes('taking')) {
      router.replace(`/${user}/test-page/${selectedTestId}`);
    }
  }, [modalTitle, dispatch, selectedTestId, currentPage, router, user]);

  const loadMoreTests = useCallback(() => {
    if (currentPage <= totalPages) {
      setCurrentPage(currentPage + 1);
      dispatch(
        getAllTestsThunk({
          page: currentPage + 1,
          per: 5,
          search: debouncedSearchValue,
          sort: filterAction,
        })
      );
    }
  }, []);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [setCurrentPage, currentPage]);

  const handlePageChange = () => {
    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: currentPage,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const fetchTests = async () => {
      const response = await dispatch(
        getAllTestsThunk({
          page: currentPage,
          per: 5,
          search: debouncedSearchValue,
          sort: filterAction,
        })
      );
      if (response.payload?.meta?.total_pages) {
        setTotalPages(response.payload.meta.total_pages);
      }
    };
    handlePageChange();
    fetchTests();
  }, [currentPage, dispatch, debouncedSearchValue, filterAction]);

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
        results.map(test => (
          <TestItem
            key={test.id}
            deleteLoading={deleteLoading}
            editTest={editTest}
            handleTakeTest={handleTakeTest}
            pathRouteTestsList={pathRouteTestsList}
            role={role}
            selectedTestId={selectedTestId}
            test={test}
            user={user}
            onClickHandlerDeleteTest={onClickHandlerDeleteTest}
          />
        ))}
      {totalPages > 1 && (
        <div className={s.pages}>
          <ChangeButton
            disabled={currentPage === 1}
            title={'Previous'}
            onClick={prevPage}
          />
          <span>Page {currentPage}</span>
          <ChangeButton
            disabled={currentPage >= totalPages}
            title={'Next'}
            onClick={loadMoreTests}
          />
        </div>
      )}
      <ModalWindow
        isModalWindowOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default memo(TakeTestsPage);
