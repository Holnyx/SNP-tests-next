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
          name="description"
          content="Tests"
        />
        <meta
          name="keywords"
          content="test, testing"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
        />
      </Head>
    </>
  );
};

export default memo(SeoTags);
