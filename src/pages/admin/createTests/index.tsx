import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';

const CreateTest = () => {
  return <AdminPage admin="admin" />;
};

export default memo(CreateTest);
