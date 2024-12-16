import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import sortIcon from '/public/img/sort-icon.svg?url';
import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import { useActionWithPayload } from '@/hooks/useAction';
import { filteredTestsByDate, setSearchQuery } from '@/store/testReduser';

import s from './Header.module.sass';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { filterSelector, testSelector } from '@/store/selectors';
import { FilteredTestsByDate } from '@/store/types';

type HeaderItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  name?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  defaultSearchValue: string;
};

const Header: FC<HeaderItems> = ({
  showSidebar,
  menuOpen,
  name,
  setSearchTerm,
  defaultSearchValue,
}) => {
  const [onClickSort, setOnClickSort] = useState(false);

  const router = useRouter();
  const test = useSelector(filterSelector);
  const setSearchQueryAction = useActionWithPayload(setSearchQuery);

  const changeTestsFilterAction = useActionWithPayload(filteredTestsByDate);

  const changeTestsFilter = useCallback((filter: FilteredTestsByDate) => {
    changeTestsFilterAction(filter);
  }, []);

  useEffect(() => {
    setOnClickSort(false);
  }, [setOnClickSort]);

  const handleSearchChange = useCallback(
    (query: string) => {
      if (query) {
        setSearchQueryAction(query);
        router.push({
          pathname: router.pathname,
          query: { ...router.query, search: query },
        });
      } else {
        router.push(router.pathname);
      }
    },
    [router, setSearchQuery]
  );

  const isTakeTests =
    router.pathname === '/admin/takeTests' ||
    router.pathname === '/user/takeTests';
  const handleSort = useCallback(() => {
    const newSortOrder = test === 'asc' ? 'desc' : 'asc';
    changeTestsFilter(newSortOrder);
  }, [test, changeTestsFilter]);
  return (
    <header className={s.container}>
      <ButtonBurgerMenu
        showSidebar={showSidebar}
        menuOpen={menuOpen}
      />
      {isTakeTests ? (
        <div className={s['search']}>
          <SearchInput
            setSearchTerm={setSearchTerm}
            defaultValue={defaultSearchValue}
            onSearchChange={handleSearchChange}
            clearSearchInput={setSearchQueryAction}
          />
          <Image
            className={cx(s['sort-icon'], {
              [s['sort-icon-click']]: test === 'asc',
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
