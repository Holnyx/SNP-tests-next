import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import TakeTestsPage from '@/components/pages/TakeTestsPage/TakeTestsPage';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import UserPage from '@/components/pages/UserPage/UserPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const TakeTests = ({
  search,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <UserPage
      user="user"
      search={search}
    ></UserPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;

  return {
    props: {
      search: search || '',
    },
  };
};
export default memo(TakeTests);
