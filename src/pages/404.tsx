import Head from 'next/head';

import NotFoundPage from '@/components/pages/NotFound/NotFound';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found</title>
        <meta
          content="Page not found"
          name="description"
        />
        <meta
          content="not found, 404"
          name="keywords"
        />
        <meta
          content="width=device-width, initial-scale=1"
          name="viewport"
        />
      </Head>
      <NotFoundPage />
    </>
  );
}
