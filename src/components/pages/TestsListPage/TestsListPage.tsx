import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';
import Footer from '@/components/commons/Footer/Footer';
import Header from '@/components/commons/Header/Header';
import SeoTags from '@/components/commons/SeoTags/SeoTags';
import Sidebar from '@/components/commons/Sidebar/Sidebar';

import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';

import { useDebounce } from '@/hooks/useDebounce';
import { sortedTestsSelector, testSelector } from '@/store/selectors';
import { TestsItem } from '@/store/types';

import s from './TestsListPage.module.sass';

type TestsListPageProps = {
  user?: string;
  id?: string;
  search: string;
  selectedTest: TestsItem | null;
  username: string;
  isAdmin: boolean;
  page: number;
};

const TestsListPage: FC<TestsListPageProps> = ({
  user,
  id,
  search,
  selectedTest,
  username,
  isAdmin,
  page,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TestsItem[]>([]);
  const [selectedTestItem, setSelectedTestItem] = useState<TestsItem | null>(
    selectedTest
  );
  const [currentPage, setCurrentPage] = useState(page);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const userRole = isAdmin === true ? 'admin' : 'user';
  const pathRouteEdit = router.pathname.startsWith(`/${userRole}/edit-test`);
  const pathRouteCreate = router.pathname === `/${userRole}/create-tests`;
  const pathRouteTestsList = router.pathname === `/${userRole}/take-tests`;
  const pathRouteTakeTest = router.asPath.startsWith(
    `/${userRole}/test-page/${id}`
  );

  const getPageType = () => {
    if (pathRouteEdit) return 'edit';
    if (pathRouteCreate) return 'create';
    if (pathRouteTakeTest) return 'takeTest';
    if (pathRouteTestsList) return 'testsList';
    return 'default';
  };

  const headerTitleByType = {
    edit: 'Edit test',
    create: 'Create test',
    takeTest: selectedTestItem?.title,
    testsList: 'Tests list',
    default: user,
  };

  const headTitle = headerTitleByType[getPageType()];

  return (
    <>
      <SeoTags title={headTitle} />
      <div
        className={s.background}
        onClick={() => {
          if (menuOpen) {
            setMenuOpen(!menuOpen);
          }
        }}
      >
        <Header
          currentPage={currentPage}
          menuOpen={menuOpen}
          name={username}
          pathRouteTestsList={pathRouteTestsList}
          searchTerm={searchTerm}
          setCurrentPage={setCurrentPage}
          setSearchTerm={setSearchTerm}
          showSidebar={setMenuOpen}
        />

        {isAdmin &&
          (router.asPath.startsWith('/admin/create-tests') ||
            router.asPath.startsWith(`/admin/edit-test/${id}`)) && (
            <CreateTests
              id={id}
              pathRouteCreate={pathRouteCreate}
              pathRouteEdit={pathRouteEdit}
              pathRouteTakeTest={pathRouteTakeTest}
              selectedTestItem={selectedTestItem}
            />
          )}

        {pathRouteTestsList && (
          <TakeTestsPage
            currentPage={currentPage}
            editTest={editTest}
            isSearching={isSearching}
            pathRouteTestsList={pathRouteTestsList}
            results={results}
            isAdmin={isAdmin}
            search={search}
            searchTerm={searchTerm}
            setCurrentPage={setCurrentPage}
            user={user}
          />
        )}
        {pathRouteTakeTest && (
          <TestPage
            pathRouteTakeTest={pathRouteTakeTest}
            selectedTestItem={selectedTestItem}
            user={user}
          />
        )}

        <Sidebar
          menuOpen={menuOpen}
          pathRouteCreate={pathRouteCreate}
          showSidebar={setMenuOpen}
          user={user}
        />
        <Footer />
      </div>
      <ErrorMessage />
    </>
  );
};

export default memo(TestsListPage);
