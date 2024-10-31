import React, { FC, memo, useState } from 'react';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';

import s from './AdminPage.module.sass';
import cx from 'classnames';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import { useRouter } from 'next/router';
import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';

type AdminPageItems = {
  admin?: string;
};

const AdminPage: FC<AdminPageItems> = ({ admin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);
  const [titleModalWindow, setTitleModalWindow] = useState('');
  const router = useRouter();
  const onClickHandler = () => {
    setModalWindowIsOpen(prevValue => !prevValue);
  };
  return (
    <>
      <HeadComponent title={'Admin'} />
      <div
        className={s.background}
        onClick={() => {
          menuOpen && setMenuOpen(!menuOpen);
        }}
      >
        <Header
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          name={admin}
        />
        {(router.pathname === '/admin/createTests' ||
          router.pathname === '/admin/editTest') && (
          <CreateTests
            setModalWindowIsOpen={onClickHandler}
            setTitleModalWindow={setTitleModalWindow}
          />
        )}

        {router.pathname === '/admin/takeTests' && (
          <TakeTestsPage
            user={'admin'}
            setModalWindowIsOpen={onClickHandler}
            setTitleModalWindow={setTitleModalWindow}
          />
        )}
        {router.pathname === '/admin/testPage' && <TestPage user={'admin'} />}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={admin}
        />
        <ModalWindow
          modalWindowIsOpen={modalWindowIsOpen}
          setModalWindowIsOpen={onClickHandler}
          titleModalWindow={titleModalWindow}
        />
        <Footer />
      </div>
    </>
  );
};

export default memo(AdminPage);
