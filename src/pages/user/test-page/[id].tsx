import React, { memo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import axios from 'axios';

import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';
import { TestsItem } from '@/store/types';

const TestPage = ({
  username,
  id,
  selectedTest,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      user={'user'}
      id={id}
      search={''}
      selectedTest={selectedTest}
      username={username}
      role={role}
    ></TestsListPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
  const { req } = context;
  const response = await axios.get(
    'https://interns-test-fe.snp.agency/api/v1/users/current',
    {
      headers: {
        Cookie: req.headers.cookie || '',
      },
    }
  );

  const user = response.data;

  const allTestsCookie = getCookie('tests', {
    req: context.req,
  });
  const allTests = allTestsCookie ? JSON.parse(allTestsCookie) : [];
  const selectedTest = allTests.find(
    (test: TestsItem) => String(test.id) === String(id)
  );
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: id as string,
      selectedTest,
      username: user ? user.username : null,
      role: user.is_admin,
    },
  };
};

export default memo(TestPage);
