import React, { FC, memo, useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Header from '@/components/commons/Header/Header';
import SeoTags from '@/components/commons/SeoTags/SeoTags';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';

import { TestsItem } from '@/store/types';
import { useDebounce } from '@/hooks/useDebounce';
import { sortedTestsSelector, testSelector } from '@/store/selectors';
import { AppDispatch } from '@/store';

import s from './UserPage.module.sass';
import cx from 'classnames';

type UserPageItems = {
  search: string;
  user?: string;
  id?: string;
  selectedTest: TestsItem;
  username: string | undefined
};

const UserPage: FC<UserPageItems> = ({ user, search, id, selectedTest, username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TestsItem[]>([]);
  const [selectedTestItem, setSelectedTestItem] =
    useState<TestsItem>(selectedTest);

  // const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const allTests = useSelector(testSelector);
  const filteredTestsByDate = useSelector(sortedTestsSelector);

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

  const pathRouteEdit = router.pathname.startsWith('/user/edit-test');
  const pathRouteCreate = router.pathname === '/user/create-tests';
  const pathRouteTestsList = router.pathname === '/user/take-tests';
  const pathRouteTakeTest = router.pathname.startsWith('/user/test-page');

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
    takeTest: selectedTestItem.title,
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
          menuOpen && setMenuOpen(!menuOpen);
        }}
      >
        <Header
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          name={username}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
        {router.pathname === '/user/take-tests' && (
          <TakeTestsPage
            user={user}
            editTest={() => {}}
            search={search}
            isSearching={isSearching}
            results={results}
            searchTerm={searchTerm}
          />
        )}
        {router.asPath.startsWith(`/${user}/test-page/${id}`) && (
          <TestPage
            user={user}
            id={id}
            selectedTestItem={selectedTestItem}
          />
        )}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={user}
        />
        <Footer />
      </div>
      <ErrorMessage />
    </>
  );
};

export default memo(UserPage);
