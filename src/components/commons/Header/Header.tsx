import React, { FC, memo } from 'react';
import Image from 'next/image';

import adminIcon from '/public/img/admin-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import s from './Header.module.sass';
import cx from 'classnames';

type HeaderItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
};

const Header: FC<HeaderItems> = ({ showSidebar, menuOpen }) => {
  return (
    <header className={s.container}>
      <ButtonBurgerMenu
        showSidebar={showSidebar}
        menuOpen={menuOpen}
      />
      <SearchInput />
      <div className={s['profile-box']}>
        <Image
          className={s['admin-icon']}
          src={adminIcon}
          alt={'adminIcon'}
        />
        <span>Admin</span>
      </div>
    </header>
  );
};

export default memo(Header);
