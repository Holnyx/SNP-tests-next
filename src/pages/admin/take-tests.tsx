import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';

import { useGetServerSideProps } from '@/hooks/useGetServerSideProps';

const TakeTests = ({
  username,
  search,
  role,
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      page={page}
      role={role}
      search={search}
      selectedTest={null}
      user={'admin'}
      username={username}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return useGetServerSideProps(context);
};

export default memo(TakeTests);
