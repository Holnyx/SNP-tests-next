import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import TakeTestsPage from '@/components/pages/TakeTestsPage/TakeTestsPage';
import AdminPage from '@/components/pages/AdminPage/AdminPage';
import UserPage from '@/components/pages/UserPage/UserPage';

const TakeTests = (
  //   {
//   user,
// }: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <UserPage user='user'>
      <TakeTestsPage user='user'/>
    </UserPage>
  );
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
