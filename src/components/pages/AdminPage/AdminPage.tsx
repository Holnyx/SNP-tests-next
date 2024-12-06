import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getCookie, setCookie } from 'cookies-next';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';
import CreateTests from '../CreateTests/CreateTests';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';

import { useDebounce } from '@/hooks/useDebounce';
import { TestsItem } from '@/store/types';
import {
  selectedTestSelector,
  sortedTestsSelector,
  testSelector,
} from '@/store/selectors';
import { useActionWithPayload } from '@/hooks/useAction';
import { initTestsFromStorage } from '@/store/testReduser';

import s from './AdminPage.module.sass';
import cx from 'classnames';

type AdminPageItems = {
  admin?: string;
  id?: string;
  search: string;
};

const AdminPage: FC<AdminPageItems> = ({ admin, id, search }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TestsItem[]>([]);

  const [selectedTestItem, setSelectedTestItem] = useState<TestsItem>({
    id: '',
    title: '',
    date: '',
    questions: [],
  });

  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const allTests = useSelector(testSelector);
  const filteredTestsByDate = useSelector(sortedTestsSelector);
  const selectedTest = useSelector(state => selectedTestSelector(state, id));
  const InitTestsFromStorageAction = useActionWithPayload(initTestsFromStorage);

  const editTest = useCallback(
    (testId: string) => {
      if (selectedTest) {
        setSelectedTestItem({
          id: testId,
          title: selectedTest.title,
          date: selectedTest.date,
          questions: selectedTest.questions,
        });
      }
    },
    [selectedTest]
  );

  const searchCharacters = (search: string): Promise<TestsItem[]> => {
    return new Promise<TestsItem[]>(resolve => {
      const filteredTests = allTests.filter(test =>
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
        date: selectedTest.date,
        questions: selectedTest.questions,
      });
    }
  }, [id, selectedTest]);

  useEffect(() => {
    const storedTests = getCookie('tests');
    if (storedTests) {
      InitTestsFromStorageAction(JSON.parse(storedTests));
    }
  }, [InitTestsFromStorageAction]);

  useEffect(() => {
    if (allTests && allTests.length > 0) {
      console.log(allTests);
      setCookie('tests', JSON.stringify(allTests), {
        path: '/',
        sameSite: 'lax',
      });
    } else {
      setCookie('tests', '');
    }
  }, [allTests]);

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
            user={'admin'}
            editTest={editTest}
            search={search}
            isSearching={isSearching}
            results={results}
          />
        )}
        {router.pathname === `/admin/testPage/${id}` && (
          <TestPage
            user={'admin'}
            id={id}
          />
        )}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={admin}
        />
        <Footer />
      </div>
    </>
  );
};

export default memo(AdminPage);
