import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';

const CreateTest = ({
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminPage
      admin="admin"
      search={''}
      selectedTest={{
        id: '',
        title: '',
        created_at: '',
        questions: [],
      }}
      username={username}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;
  const { req } = context;
  const response = await axios.get(
    'https://interns-test-fe.snp.agency/api/v1/users/current',
    {
      headers: {
        Cookie: req.headers.cookie || '',
      },
    }
  );

  const user = response.data;
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {
      search: search || '',
      username: user ? user.username : null,
    },
  };
};

export default memo(CreateTest);
