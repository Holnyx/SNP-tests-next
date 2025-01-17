import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getCookie } from 'cookies-next';
import { TestsItem } from '@/store/types';

const EditTests = ({
  user,
  id,
  selectedTest,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <AdminPage
      admin="admin"
      id={id}
      selectedTest={selectedTest} 
      search={''}
    />
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
        selectedTest,
      },
    };
  }

  return {
    notFound: true,
  };
};

export default memo(EditTests);