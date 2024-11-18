import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';

import {
  selectedQuestionSelector,
  selectedTestSelector,
} from '@/store/selectors';
import { SelectedTestItems, TestsOptionsForSelect } from '@/store/types';

import s from './AdminPage.module.sass';
import cx from 'classnames';

type AdminPageItems = {
  admin?: string;
};

const AdminPage: FC<AdminPageItems> = ({ admin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalWindowIsOpen, setModalWindowIsOpen] = useState(false);
  const [titleModalWindow, setTitleModalWindow] = useState('');
  const router = useRouter();
  const onClickHandler = useCallback(() => {
    setModalWindowIsOpen(prevValue => !prevValue);
  }, []);

  const [modalFunctionOnClick, setModalFunctionOnClick] = useState(false);

  ////////////////////////////
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [selectedTestItem, setSelectedTestItem] = useState<SelectedTestItems>({
    title: '',
    questions: [
      {
        id: '',
        title: '',
        questionType: 'radio',
        answer: [
          {
            id: '',
            title: '',
            name: '',
            isTrue: false,
          },
        ],
      },
    ],
  });

  const selectedTest = useSelector(state =>
    selectedTestSelector(state, selectedTestId)
  );
  const selectedQuestion = useSelector(state =>
    selectedQuestionSelector(state, selectedTestId)
  );

  const openEditPage = useCallback(
    (id: string) => {
      selectedTest &&
        setSelectedTestItem({
          title: selectedTest.title,
          questions: [
            {
              id: '',
              title: '',
              questionType: 'none' as TestsOptionsForSelect,
              answer: [
                {
                  id: '',
                  title: '',
                  name: '',
                  isTrue: false,
                },
              ],
            },
          ],
        });
      // setEditIsOpen(true);
      setSelectedTestId(id);
    },
    [selectedTestSelector]
  );

  // Update input values
  // useEffect(() => {
  //   if (selectedTest) {
  //     setSelectedTestItem({
  //       title: selectedTest.title,
  //       questions: selectedQuestion ? [{
  //         id: selectedQuestion.id,
  //         title: selectedQuestion.title,
  //         questionType: selectedQuestion.questionType,
  //         answer: [
  //           {
  //             id: '',
  //             title: '',
  //             name: '',
  //             isTrue: false,
  //           },]
  //       }] : []
  //     });
  //   }
  // }, [selectedTest, selectedTestId]);

  // selectedMusicItem={selectedMusicItem}
  // selectedMusicId={selectedMusicId}

  ////////////////

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
            openEditPage={openEditPage}
            selectedTestId={selectedTestId}
            modalFunctionOnClick={modalFunctionOnClick}
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
          setModalFunctionOnClick={setModalFunctionOnClick}
        />
        <Footer />
      </div>
    </>
  );
};

export default memo(AdminPage);
