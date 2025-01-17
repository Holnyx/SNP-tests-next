import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import TakeTestsPage from '@/components/pages/TakeTestsPage/TakeTestsPage';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import UserPage from '@/components/pages/UserPage/UserPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const TakeTests = ({
  username,
  search,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <UserPage
      user={username}
      search={search} selectedTest={{
        id: '',
        title: '',
        created_at: '',
        questions: []
      }}    ></UserPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;
  const cookies = context.req.cookies;
  const username = cookies.username || 'user';
  return {
    props: {
      search: search || '',
      username,
    },
  };
};
export default memo(TakeTests);
