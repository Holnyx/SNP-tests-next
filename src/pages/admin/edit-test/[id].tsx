/* eslint-disable react-hooks/rules-of-hooks */
import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';

import { useGetServerSideProps } from '@/hooks/useGetServerSideProps';

const EditTests = ({
  username,
  id,
  selectedTest,
  isAdmin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <TestsListPage
      id={id}
      isAdmin={isAdmin}
      page={0}
      search={''}
      selectedTest={selectedTest}
      user="admin"
      username={username}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return useGetServerSideProps(context, { includeSelectedTest: true });
};

export default memo(EditTests);
