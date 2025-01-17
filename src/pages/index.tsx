import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { parseCookies } from 'nookies';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';

const Home = (
) => {
  const router = useRouter();

  return (
    <>
      <HeadComponent />
    </>
  );
};

export default memo(Home);
