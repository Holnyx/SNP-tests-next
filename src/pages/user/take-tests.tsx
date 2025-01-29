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
      user={'user'}
      search={search}
      selectedTest={null}
      username={username}
      role={role}
      page={page}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return useGetServerSideProps(context);
};

export default memo(TakeTests);
