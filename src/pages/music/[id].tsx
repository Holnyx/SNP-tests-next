import { memo } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

import { MUSICS_API_URL } from '@/api/api';

import MusicPage from '@/components/pages/MusicPage/MusicPage';
import ErrorMessage from '@/components/commons/ErrorMessage/ErrorMessage';

const MusicInfoPage = ({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <MusicPage id={id} />
      <ErrorMessage/>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.query;
  const selectedMusic = await fetch(`${MUSICS_API_URL}/${id}`);
  if (selectedMusic.ok) {
    return {
      props: {
        id,
        music: await selectedMusic.json(),
      },
    };
  }
  return {
    notFound: true,
  };
};

export default memo(MusicInfoPage);
