import React, { FC, memo } from 'react';

import Head from 'next/head';

type SeoTagsProps = {
  title?: string;
};

const SeoTags: FC<SeoTagsProps> = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title ? title : 'Tests'}</title>
        <meta
          content="Tests"
          name="description"
        />
        <meta
          content="test, testing"
          name="keywords"
        />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
          name="viewport"
        />
      </Head>
    </>
  );
};

export default memo(SeoTags);
