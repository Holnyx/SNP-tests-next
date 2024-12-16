import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import Header from '@/components/commons/Header/Header';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import TakeTestsPage from '../TakeTestsPage/TakeTestsPage';
import TestPage from '../TestPage/TestPage';
import Sidebar from '@/components/commons/Sidebar/Sidebar';
import Footer from '@/components/commons/Footer/Footer';

import { TestsItem } from '@/store/types';
import { useDebounce } from '@/hooks/useDebounce';
import { selectedTestSelector, testSelector } from '@/store/selectors';
import { useActionWithPayload } from '@/hooks/useAction';
import { getAllTestsThunk } from '@/thunk/testsThunk';

import s from './UserPage.module.sass';
import cx from 'classnames';

type UserPageItems = {
  search: string;
  user?: string;
  id?: string;
};

const UserPage: FC<UserPageItems> = ({ user, search, id }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(search);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<TestsItem[]>([]);

  const router = useRouter();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const allTests = useSelector(testSelector);
  const selectedTest = useSelector(state => selectedTestSelector(state, id));
  // const getAllTestsAction = useActionWithPayload(getAllTestsThunk);

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
      setResults(allTests);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm, allTests]);

  // useEffect(() => {
  //   getAllTestsAction({ page: 1, per: 10, search: '', sort: 'desc' });
  // }, [getAllTestsAction]);

  useEffect(() => {
    if (allTests.length > 0) {
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
      <HeadComponent title={user} />
      <div className={s.background}>
        <Header
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          name={user}
          setSearchTerm={setSearchTerm}
          defaultSearchValue={''}
        />
        <TakeTestsPage
          user={'user'}
          editTest={() => {}}
          search={search}
          isSearching={isSearching}
          results={results}
        />
        {router.pathname === `/user/testPage/${id}` && (
          <TestPage
            user={'user'}
            id={id}
          />
        )}

        <Sidebar
          showSidebar={setMenuOpen}
          menuOpen={menuOpen}
          user={user}
        />
        <Footer />
      </div>
    </>
  );
};

export default memo(UserPage);
