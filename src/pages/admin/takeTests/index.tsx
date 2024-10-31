import React, { memo } from 'react';
import AdminPage from '@/components/pages/AdminPage/AdminPage';

const TakeTests = () =>
  //   {
  //   user,
  // }: InferGetServerSidePropsType<typeof getServerSideProps>
  {
    return (
      <AdminPage admin='admin'>
      </AdminPage>
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
