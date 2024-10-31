import React, { FC, memo } from 'react';
import Image from 'next/image';

import adminIcon from '/public/img/admin-icon.svg?url';
import userIcon from '/public/img/user-icon.svg?url';
import SearchInput from '../SearchInput/SearchInput';
import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';

import s from './Header.module.sass';
import cx from 'classnames';
import { useRouter } from 'next/router';

type HeaderItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  name?: string;
};

const Header: FC<HeaderItems> = ({ showSidebar, menuOpen, name }) => {
  const router = useRouter();
  const isTakeTests = router.pathname === '/admin/takeTests' || router.pathname === '/user/takeTests';

  return (
    <header className={s.container}>
      <ButtonBurgerMenu
        showSidebar={showSidebar}
        menuOpen={menuOpen}
      />
      {isTakeTests ? <SearchInput /> : ''}
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
