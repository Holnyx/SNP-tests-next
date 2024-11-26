import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import { TestsItem } from '@/store/types';
import UserPage from '@/components/pages/UserPage/UserPage';

const TestPage = ({
  user,
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <UserPage
      user="user"
      id={id}
      search={''}
    ></UserPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;

  const allTestsCookie = getCookie('tests', {
    req: context.req,
  });
  const allTests = allTestsCookie ? JSON.parse(allTestsCookie) : [];
  const selectedTest = allTests.find(
    (test: TestsItem) => String(test.id) === String(id)
  );

  if (selectedTest) {
    return {
      props: {
        id,
      },
    };
  }
  return {
    notFound: true,
  };
};

export default memo(TestPage);
