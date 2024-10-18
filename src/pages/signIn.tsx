import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Authorization from '@/components/pages/Authorization/Authorization';

const SignInPage = () => {
  return (
    <>
      <HeadComponent title="Sign In" />
      <Authorization />
    </>
  );
};

export default memo(SignInPage);
