import React, { FC, memo, ReactNode, useState } from 'react';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';

import s from './UserPage.module.sass';
import cx from 'classnames';

type UserPageItems = {
  children: ReactNode;
  user?: string;
};

const UserPage: FC<UserPageItems> = ({ children, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <HeadComponent title={user} />
      <div className={s.background}>
        <Header
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          name={user}
        />
        {children}
        <Sidebar
          user={user}
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
        />
        <Footer />
      </div>
    </>
  );
};

export default memo(UserPage);
