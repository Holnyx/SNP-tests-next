import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';
import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';

const TakeTests = ({
  search,
  username,
  role,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      user={'admin'}
      search={search}
      selectedTest={null}
      username={username}
      role={role}
    ></TestsListPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;
  const { req, res } = context;
  const response = await axios.get(
    'https://interns-test-fe.snp.agency/api/v1/users/current',
    {
      headers: {
        Cookie: req.headers.cookie || '',
      },
    }
  );

  const user = response.data;
  if (user && !user.is_admin) {
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
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: {
      search: search || '',
      username: user ? user.username : null,
      role: user.is_admin,
    },
  };
};

export default memo(TakeTests);
