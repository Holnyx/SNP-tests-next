import React, { memo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import Authorization from '@/components/pages/Authorization/Authorization';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';
import SeoTags from '@/components/commons/SeoTags/SeoTags';
import axios from 'axios';

const SignInPage = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  return (
    <>
      <SeoTags title="Sign In" />
      <Authorization url={'sign-in'} />
      <ErrorMessage />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { req } = context;

  try {
    const response = await axios.get(
      'https://interns-test-fe.snp.agency/api/v1/users/current',
      {
        headers: {
          Cookie: req.headers.cookie || '',
        },
      }
    );

    const user = response.data;

    if (user) {
      if (user.is_admin) {
        return {
          redirect: {
            destination: '/admin/take-tests',
            permanent: false,
          },
        };
      } else {
        return {
          redirect: {
            destination: '/user/take-tests',
            permanent: false,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
  }

  return {
    props: {},
  };
};

export default memo(SignInPage);
