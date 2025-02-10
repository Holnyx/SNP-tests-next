import React, { FC, memo, useCallback } from 'react';

import { useRouter } from 'next/router';

import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';
import ProfileBoxIcon from '../ProfileBoxIcon/ProfileBoxIcon';
import SearchInput from '../SearchInput/SearchInput';
import SortIcon from '../SortIcon/SortIcon';

import { useActionWithPayload } from '@/hooks/useAction';
import { useDebounce } from '@/hooks/useDebounce';
import { setSearchQuery } from '@/store/testReducer';

import s from './Header.module.sass';

type HeaderProps = {
  showSidebar: (v: boolean) => void;
  menuOpen: boolean;
  name?: string;
  setSearchTerm: (v: string) => void;
  searchTerm: string;
  setCurrentPage: (v: number) => void;
  currentPage: number;
  pathRouteTestsList: boolean;
};

const Header: FC<HeaderProps> = ({
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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const setSearchQueryAction = useActionWithPayload(setSearchQuery);

  const handleSearchChange = useCallback(
    (query: string) => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            search: query || undefined,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  return (
    <header className={s.container}>
      <ButtonBurgerMenu
        menuOpen={menuOpen}
        showSidebar={showSidebar}
      />
      {pathRouteTestsList ? (
        <div className={s['search']}>
          <SearchInput
            clearSearchInput={setSearchQueryAction}
            defaultValue={debouncedSearchTerm}
            setSearchTerm={setSearchTerm}
            onSearchChange={handleSearchChange}
          />
          <SortIcon
            currentPage={currentPage}
            searchTerm={searchTerm}
            setCurrentPage={setCurrentPage}
          />
        </div>
      ) : (
        ''
      )}
      <ProfileBoxIcon name={name} />
    </header>
  );
};

export default memo(Header);
