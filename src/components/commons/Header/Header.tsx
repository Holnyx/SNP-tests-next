import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import sortIcon from '/public/img/sort-icon.svg?url';
import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import s from './Header.module.sass';
import cx from 'classnames';
import { useActionWithPayload } from '@/hooks/useAction';
import {
  setSearchQuery,
  sortTestsByDateAsc,
  sortTestsByDateDesc,
} from '@/store/testReduser';

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

  const setSearchQueryAction = useActionWithPayload(setSearchQuery);
  const sortTestsByDateAscAction = useActionWithPayload(sortTestsByDateAsc);
  const sortTestsByDateDescAction = useActionWithPayload(sortTestsByDateDesc);

  const onClickSortFunction = useCallback(() => {
    if (onClickSort) {
      sortTestsByDateDescAction();
    } else {
      sortTestsByDateAscAction();
    }
    setOnClickSort(prevValue => !prevValue);
  }, [onClickSort]);

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
              [s['sort-icon-click']]: onClickSort,
            })}
            src={sortIcon}
            alt={'adminIcon'}
            onClick={onClickSortFunction}
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
