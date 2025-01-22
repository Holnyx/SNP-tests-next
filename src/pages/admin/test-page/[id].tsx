import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import { TestsItem } from '@/store/types';
import axios from 'axios';

const TestPage = ({
  username,
  id,
  selectedTest,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminPage
      admin={'admin'}
      id={id}
      search={''}
      selectedTest={selectedTest}
      username={username}
    ></AdminPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
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

  const allTestsCookie = getCookie('tests', {
    req: context.req,
  });
  const allTests = allTestsCookie ? JSON.parse(allTestsCookie) : [];
  const selectedTest = allTests.find(
    (test: TestsItem) => String(test.id) === String(id)
  );

  if (!user) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  // if (user && user.is_admin) {
  //   return {
  //     redirect: {
  //       destination: '/admin/take-tests',
  //       permanent: false,
  //     },
  //   };
  // }

  // if (!selectedTest || selectedTest.user_id !== user.id) {
  //   return {
  //     notFound: true,
  //     props: {
  //       username: user ? user.username : null,
  //     },
  //   };
  // }

  return {
    props: {
      id: id as string,
      selectedTest,
      username: user ? user.username : null,
    },
  };
};

export default memo(TestPage);
