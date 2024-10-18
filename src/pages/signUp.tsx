import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Registration from '@/components/pages/Registration/Registration';

const SignUpPage = () => {
  return (
    <>
      <HeadComponent title="Sign Up" />
      <Registration />
    </>
  );
};

export default memo(SignUpPage);
