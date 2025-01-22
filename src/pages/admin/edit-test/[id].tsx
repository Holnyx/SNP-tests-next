import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import { TestsItem } from '@/store/types';
import axios from 'axios';
import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';

const EditTests = ({
  username,
  id,
  selectedTest,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      user="admin"
      id={id}
      selectedTest={selectedTest}
      search={''}
      username={username}
      role={role}
    />
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

  if (user && user.is_admin === false) {
    return {
      redirect: {
        destination: '/user/take-tests',
        permanent: false,
      },
    };
  }
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

export default memo(EditTests);
