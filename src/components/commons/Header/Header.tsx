import React, { FC, memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import sortIcon from '/public/img/sort-icon.svg?url';
import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import { useActionWithPayload } from '@/hooks/useAction';
import { filteredTestsByDate, setSearchQuery } from '@/store/testReducer';
import { filterSelector } from '@/store/selectors';
import { FilteredTestsByDate } from '@/store/types';
import { useDebounce } from '@/hooks/useDebounce';
import { AppDispatch } from '@/store';
import { getAllTestsThunk } from '@/thunk/testsThunk';

import s from './Header.module.sass';
import cx from 'classnames';

type HeaderItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  name?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pathRouteTestsList: boolean;
};

const Header: FC<HeaderItems> = ({
  showSidebar,
  menuOpen,
  name,
  setSearchTerm,
  searchTerm,
  setCurrentPage,
  currentPage,
  pathRouteTestsList,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const filterAction = useSelector(filterSelector);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const setSearchQueryAction = useActionWithPayload(setSearchQuery);
  const changeTestsFilterAction = useActionWithPayload(filteredTestsByDate);

  const changeTestsFilter = useCallback((filter: FilteredTestsByDate) => {
    dispatch(
      getAllTestsThunk({
        page: currentPage,
        per: 5,
        search: debouncedSearchTerm,
        sort: filter,
      })
    ).then(() => changeTestsFilterAction(filter));
  }, []);

  const handleSearchChange = useCallback(
    (query: string) => {
      if (query) {
        setSearchQueryAction(query);
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, search: query },
        });
      } else {
        router.replace(router.pathname);
      }
    },
    [router, setSearchQueryAction]
  );

  const handleSort = useCallback(() => {
    const newSortOrder =
      filterAction === 'created_at_asc' ? 'created_at_desc' : 'created_at_asc';
    changeTestsFilter(newSortOrder);
    setCurrentPage(1);
  }, [filterAction, changeTestsFilter]);

  return (
    <header className={s.container}>
      <ButtonBurgerMenu
        showSidebar={showSidebar}
        menuOpen={menuOpen}
      />
      {pathRouteTestsList ? (
        <div className={s['search']}>
          <SearchInput
            setSearchTerm={setSearchTerm}
            defaultValue={debouncedSearchTerm}
            onSearchChange={handleSearchChange}
            clearSearchInput={setSearchQueryAction}
          />
          <Image
            className={cx(s['sort-icon'], {
              [s['sort-icon-click']]: filterAction === 'created_at_asc',
            })}
            src={sortIcon}
            alt={'adminIcon'}
            onClick={handleSort}
          />
        </div>
      ) : (
        ''
      )}

      <div className={s['profile-box']}>
        <Image
          className={s['admin-icon']}
          src={name === 'user' ? userIcon : adminIcon}
          alt={'adminIcon'}
        />
        <span>{name}</span>
      </div>
    </header>
  );
};

export default memo(Header);
