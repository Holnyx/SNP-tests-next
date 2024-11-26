import React, { FC, memo, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import sortIcon from '/public/img/sort-icon.svg?url';
import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import s from './Header.module.sass';
import cx from 'classnames';

type HeaderItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  name?: string;
};

const Header: FC<HeaderItems> = ({ showSidebar, menuOpen, name }) => {
  const [onClickSort, setOnClickSort] = useState(false);
  const router = useRouter();
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
          <SearchInput />
          <Image
            className={cx(s['sort-icon'], {
              [s['sort-icon-click']]: onClickSort,
            })}
            src={sortIcon}
            alt={'adminIcon'}
            onClick={() => setOnClickSort(prevValue => !prevValue)}
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
