import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';
import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';

import { useDebounce } from '@/hooks/useDebounce';
import { TestsItem } from '@/store/types';
import { sortedTestsSelector, testSelector } from '@/store/selectors';
import { AppDispatch } from '@/store';

import s from './AdminPage.module.sass';
import cx from 'classnames';

type AdminPageItems = {
  admin?: string;
  id?: string;
  search: string;
  selectedTest: TestsItem;
};

const AdminPage: FC<AdminPageItems> = ({ admin, id, search, selectedTest }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TestsItem[]>([]);
  const [selectedTestItem, setSelectedTestItem] =
    useState<TestsItem>(selectedTest);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const allTests = useSelector(testSelector);
  const filteredTestsByDate = useSelector(sortedTestsSelector);

  const editTest = useCallback(
    (testId: string) => {
      if (selectedTest) {
        setSelectedTestItem({
          id: testId,
          title: selectedTest.title,
          created_at: selectedTest.created_at,
          questions: selectedTest.questions,
        });
      }
    },
    [selectedTest]
  );

  const searchCharacters = (search: string): Promise<TestsItem[]> => {
    return new Promise<TestsItem[]>(resolve => {
      const filteredTests = filteredTestsByDate.filter(test =>
        test.title.toLowerCase().includes(search.toLowerCase())
      );
      resolve(filteredTests);
    });
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      setTimeout(() => {
        searchCharacters(debouncedSearchTerm).then((results: TestsItem[]) => {
          setIsSearching(false);
          setResults(results);
        });
      }, 500);
    } else {
      setResults(filteredTestsByDate);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, filteredTestsByDate]);

  useEffect(() => {
    if (id && selectedTest) {
      setSelectedTestItem({
        id,
        title: selectedTest.title,
        created_at: selectedTest.created_at,
        questions: selectedTest.questions,
      });
    }
  }, [id, selectedTest]);

  useEffect(() => {
    if (allTests && allTests.length > 0) {
      setCookie('tests', JSON.stringify(allTests));
    } else {
      setCookie('tests', '');
    }
  }, [allTests]);

  // useEffect(() => {
  //   dispatch(
  //     getAllTestsThunk({
  //       page: currentPage,
  //       per: 5,
  //       search: '',
  //       sort: 'created_at_desc',
  //     })
  //   );
  // }, [currentPage, dispatch]);

  const pathRouteEdit = router.pathname.startsWith('/admin/editTest');
  const pathRouteCreate = router.pathname === '/admin/createTests';
  const pathRouteTestsList = router.pathname === '/admin/takeTests';
  const pathRouteTakeTest = router.pathname.startsWith('/admin/testPage');
  const headTitle = pathRouteEdit
    ? 'Edit test'
    : pathRouteCreate
    ? 'Create test'
    : pathRouteTakeTest
    ? selectedTestItem.title
    : pathRouteTestsList
    ? 'Tests list'
    : 'Admin';
  return (
    <>
      <HeadComponent title={headTitle} />
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
          defaultSearchValue={debouncedSearchTerm}
          setSearchTerm={setSearchTerm}
        />

        {(router.asPath.startsWith('/admin/createTests') ||
          router.asPath.startsWith(`/admin/editTest/${id}`)) && (
          <CreateTests
            id={id}
            selectedTestItem={selectedTestItem}
          />
        )}

        {router.pathname === '/admin/takeTests' && (
          <TakeTestsPage
            user={admin}
            editTest={editTest}
            search={search}
            isSearching={isSearching}
            results={results}
          />
        )}
        {router.asPath.startsWith(`/${admin}/testPage/${id}`) && (
          <TestPage
            user={admin}
            id={id}
            selectedTestItem={selectedTestItem}
          />
        )}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={admin}
        />
        <Footer />
      </div>
      <ErrorMessage />
    </>
  );
};

export default memo(AdminPage);
