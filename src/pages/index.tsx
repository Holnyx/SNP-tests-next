import { memo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import HomePage from '@/components/pages/HomePage/HomePage';
import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';
import { useActionWithPayload } from '@/hooks/useAction';
import { removeErrorAC } from '@/store/actions';

const Home = ({
  search,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <HeadComponent />
      <HomePage search={search} />
      <ErrorMessage/>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { search } = context.query;

  return {
    props: {
      search: search || '',
    },
  };
};
export default memo(Home);
