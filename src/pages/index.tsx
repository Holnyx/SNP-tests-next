import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';

const Home = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  useEffect(() => {
    if (!props) {
      router.push('/signIn');
    }
  }, [props]);

  return (
    <>
      <HeadComponent />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { req } = context;
  const cookies = req.headers.cookie;

  if (!cookies) {
    return {
      redirect: {
        destination: '/signIn',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default memo(Home);
