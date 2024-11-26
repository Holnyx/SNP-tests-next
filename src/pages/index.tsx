import { memo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { parseCookies } from 'nookies';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';

const Home = (
//   {
//   props,
// }: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();

  return (
    <>
      <HeadComponent />
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async context => {
//   const cookies = parseCookies(context);
//   const userRole = cookies.userRole;

//   if (!userRole) {
//     return {
//       redirect: {
//         destination: '/signIn',
//         permanent: false,
//       },
//     };
//   }

//   if (userRole === 'user') {
//     return {
//       redirect: {
//         destination: '/user-page',
//         permanent: false,
//       },
//     };
//   } else if (userRole === 'admin') {
//     return {
//       redirect: {
//         destination: '/admin-page',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     redirect: {
//       destination: '/signIn',
//       permanent: false,
//     },
//   };
// };

export default memo(Home);
