import Head from 'next/head';
import NotFoundPage from '@/components/pages/NotFound/NotFound';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page not found</title>
        <meta
          name="description"
          content="Page not found"
        />
        <meta
          name="keywords"
          content="not found, 404"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>
      <NotFoundPage />
    </>
  );
}
