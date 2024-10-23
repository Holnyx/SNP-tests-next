import React, { Children, FC, memo, ReactNode, useState } from 'react';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import CreateTests from '../CreateTests/CreateTests';

import s from './UserPage.module.sass';
import cx from 'classnames';

type UserPageItems = {
  children: ReactNode;
};

const UserPage: FC<UserPageItems> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <HeadComponent title={'User'} />
      <div className={s.background}>
        <Header
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
        />
        {children}
        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
        />
      </div>
    </>
  );
};

export default memo(UserPage);
