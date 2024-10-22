import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import CreateTests from '@/components/pages/CreateTests/CreateTests';

const Home = ({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (!props) {
  //     router.push('/signIn');
  //   }
  // }, [props]);

  return (
    <>
      <HeadComponent />
      <AdminPage>
        <CreateTests />
      </AdminPage>
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
