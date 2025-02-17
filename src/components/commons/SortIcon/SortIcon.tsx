import { FC, memo, useCallback, useEffect } from 'react';

import Image from 'next/image';

import sortIcon from '/public/img/sort-icon.svg?url';

import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { useActionWithPayload } from '@/hooks/useAction';
import { useDebounce } from '@/hooks/useDebounce';
import { AppDispatch } from '@/store';
import { filterSelector } from '@/store/selectors';
import { filteredTestsByDate, setSortQuery } from '@/store/testReducer';
import { FilteredTestsByDate } from '@/store/types';
import { getAllTestsThunk } from '@/thunk/testsThunk';

import s from './SortIcon.module.sass';
import cx from 'classnames';

type SortIconProps = {
  currentPage: number;
  searchTerm: string;
  setCurrentPage: (v: number) => void;
};

const SortIcon: FC<SortIconProps> = ({
  currentPage,
  searchTerm,
  setCurrentPage,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const filterAction = useSelector(filterSelector);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const setSortQueryAction = useActionWithPayload(setSortQuery);
  const changeTestsFilterAction = useActionWithPayload(filteredTestsByDate);

  const initialSortOrder = router.query.sort || filterAction;
  const newSortOrder =
    initialSortOrder === 'created_at_asc'
      ? 'created_at_desc'
      : 'created_at_asc';

  const handleSortChange = useCallback(
    (sortOrder: string) => {
      router.replace(
        {
          pathname: router.pathname,
          query: { page: 1, ...router.query, sort: sortOrder },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const changeTestsFilter = useCallback(
    (filter: FilteredTestsByDate) => {
      dispatch(
        getAllTestsThunk({
          page: currentPage,
          per: 5,
          search: debouncedSearchTerm,
          sort: filter,
        })
      ).then(() => changeTestsFilterAction(filter));
    },
    [changeTestsFilterAction, currentPage, debouncedSearchTerm, dispatch]
  );

  const handleSort = useCallback(() => {
    handleSortChange(newSortOrder);
    changeTestsFilter(newSortOrder);
    setCurrentPage(1);
  }, [handleSortChange, newSortOrder, changeTestsFilter, setCurrentPage]);

  useEffect(() => {
    if (!router.query.sort && filterAction) {
      setSortQueryAction(filterAction);
    } else if (router.query.sort) {
      setSortQueryAction(router.query.sort);
    }
  }, [router.query.sort, filterAction, setSortQueryAction]);

  return (
    <Image
      alt={'adminIcon'}
      className={cx(s['sort-icon'], {
        [s['sort-icon-click']]: filterAction === 'created_at_asc',
      })}
      src={sortIcon}
      onClick={handleSort}
    />
  );
};
export default memo(SortIcon);
