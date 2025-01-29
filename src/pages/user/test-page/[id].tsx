import React, { memo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import TestsListPage from '@/components/pages/TestsListPage/TestsListPage';
import { useGetServerSideProps } from '@/hooks/useGetServerSideProps';

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
      page={0}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  return useGetServerSideProps(context, { includeSelectedTest: true });
};

export default memo(TestPage);
