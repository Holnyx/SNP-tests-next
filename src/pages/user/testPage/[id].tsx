import React, { memo } from 'react';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import { TestsItem } from '@/store/types';
import UserPage from '@/components/pages/UserPage/UserPage';

const TestPage = ({
  username,
  id,
  selectedTest,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <UserPage
      user={username}
      id={id}
      search={''}
      selectedTest={selectedTest}
    ></UserPage>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
  const cookies = context.req.cookies;
  const username = cookies.username || 'user';

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
        selectedTest,
        username,
      },
    };
  }
  return {
    notFound: true,
  };
};

export default memo(TestPage);
