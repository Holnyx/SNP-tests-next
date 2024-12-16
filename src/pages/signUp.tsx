import React, { memo } from 'react';

import HeadComponent from '@/components/commons/HeadComponent/HeadComponent';
import Registration from '@/components/pages/Registration/Registration';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';

const SignUpPage = () => {
  return (
    <>
      <HeadComponent title="Sign Up" />
      <Registration />
      <ErrorMessage/>
    </>
  );
};

export default memo(SignUpPage);
