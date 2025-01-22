import React, { FC, memo } from 'react';
import Head from 'next/head';

type SeoTagsItems = {
  title?: string;
};

const SeoTags: FC<SeoTagsItems> = ({ title }) => {
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
        <link
          rel="icon"
          href="/favicon.svg"
          type="image/svg"
        ></link>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
    </>
  );
};

export default memo(SeoTags);
