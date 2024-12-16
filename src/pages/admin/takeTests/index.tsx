import React, { memo } from 'react';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const TakeTests = ({
  search,
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminPage
      admin={username}
      search={search}
    ></AdminPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;
  const cookies = context.req.cookies;
  const username = cookies.username || 'admin';
  return {
    props: {
      search: search || '',
      username,
    },
  };
};

export default memo(TakeTests);
