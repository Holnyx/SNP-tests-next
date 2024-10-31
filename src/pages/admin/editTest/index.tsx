import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import TakeTestsPage from '@/components/pages/TakeTestsPage/TakeTestsPage';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import CreateTests from '@/components/pages/CreateTests/CreateTests';

const TakeTests = () =>
  //   {
  //   user,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>
  {
    return <AdminPage admin="admin" />;
  };

// export const getServerSideProps: GetServerSideProps = async context => {
//   const username = context.params;
//   const res = await fetch(`https://yourapi.com/users/${username}`);
//   const user = await res.json();

//   if (user) {
//     return {
//       props: { user },
//     };
//   }

//   return {
//     notFound: true,
//   };
// };

export default memo(TakeTests);
