/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';

import { useGetServerSideProps } from '@/hooks/useGetServerSideProps';

const TakeTests = ({
  username,
  search,
  isAdmin,
  page,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      isAdmin={isAdmin}
      page={page}
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
