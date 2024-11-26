import React, { memo } from 'react';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const TakeTests = ({
  search,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <AdminPage admin="admin" search={search}></AdminPage>;
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
