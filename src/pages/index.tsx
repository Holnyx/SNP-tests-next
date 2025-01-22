import { memo } from 'react';

import SeoTags from '@/components/commons/SeoTags/SeoTags';
import HomePage from '@/components/pages/HomePage/HomePage';

const Home = () => {
  return (
    <>
      <SeoTags />
      <HomePage />
    </>
  );
};

export default memo(Home);
