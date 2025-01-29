import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';

import Header from '@/components/commons/Header/Header';
import SeoTags from '@/components/commons/SeoTags/SeoTags';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';
import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';

import { useDebounce } from '@/hooks/useDebounce';
import { TestsItem } from '@/store/types';
import { sortedTestsSelector, testSelector } from '@/store/selectors';

import s from './TestsListPage.module.sass';

type TestsListPageProps = {
  user?: string;
  id?: string;
  search: string;
  selectedTest: TestsItem | null;
  username: string;
  role: boolean;
  page: number;
};

const TestsListPage: FC<TestsListPageProps> = ({
  user,
  id,
  search,
  selectedTest,
  username,
  role,
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

  const userRole = role === true ? 'admin' : 'user';
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
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          name={username}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pathRouteTestsList={pathRouteTestsList}
        />

        {role &&
          (router.asPath.startsWith('/admin/create-tests') ||
            router.asPath.startsWith(`/admin/edit-test/${id}`)) && (
            <CreateTests
              id={id}
              selectedTestItem={selectedTestItem}
              pathRouteEdit={pathRouteEdit}
              pathRouteCreate={pathRouteCreate}
              pathRouteTakeTest={pathRouteTakeTest}
            />
          )}

        {pathRouteTestsList && (
          <TakeTestsPage
            user={user}
            editTest={editTest}
            search={search}
            isSearching={isSearching}
            results={results}
            searchTerm={searchTerm}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pathRouteTestsList={pathRouteTestsList}
            role={role}
          />
        )}
        {pathRouteTakeTest && (
          <TestPage
            user={user}
            selectedTestItem={selectedTestItem}
            pathRouteTakeTest={pathRouteTakeTest}
          />
        )}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={user}
          pathRouteCreate={pathRouteCreate}
        />
        <Footer />
      </div>
      <ErrorMessage />
    </>
  );
};

export default memo(TestsListPage);
