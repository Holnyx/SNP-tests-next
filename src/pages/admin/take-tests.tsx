import React, { memo } from 'react';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import axios from 'axios';

const TakeTests = ({
  search,
  username,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminPage
      admin={'admin'}
      search={search}
      selectedTest={{
        id: '',
        title: '',
        created_at: '',
        questions: [],
      }}
      username={username}
    ></AdminPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;
  const { req, res } = context;
  const response = await axios.get(
    'https://interns-test-fe.snp.agency/api/v1/users/current',
    {
      headers: {
        Cookie: req.headers.cookie || '',
      },
    }
  );

  const user = response.data;
  if (user && !user.is_admin) {
    return {
      redirect: {
        destination: '/user/take-tests',
        permanent: false,
      },
    };
  }
  if (!user) {
    return {
      redirect: {
        destination: '/sign-in',
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

export default memo(TakeTests);
