import React, { memo } from 'react';

import AdminPage from '@/components/pages/AdminPage/AdminPage';

const CreateTest = () => {
  return (
    <AdminPage
      admin="admin"
      search={''}
      selectedTest={{
        id: '',
        title: '',
        created_at: '',
        questions: [],
      }}
    />
  );
};

export default memo(CreateTest);
