import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';

import axios from 'axios';

interface FetchUserDataOptions {
  includeSelectedTest?: boolean;
}
export const useGetServerSideProps = async (
  context: GetServerSidePropsContext,
  options?: FetchUserDataOptions
) => {
  const { search, id } = context.query;
  const { req } = context;
  const response = await axios.get(
    'https://interns-test-fe.snp.agency/api/v1/users/current',
    {
      headers: {
        Cookie: req.headers.cookie || '',
      },
    }
  );
  const page = parseInt(context.query.page as string, 10) || 1;
  const user = response.data;

  let selectedTest = null;
  if (options?.includeSelectedTest && id) {
    const allTestsCookie = getCookie('tests', { req: context.req });
    const allTests = allTestsCookie ? JSON.parse(allTestsCookie) : [];
    selectedTest = allTests.find((test: any) => String(test.id) === String(id));
  }

  if (user && !user.is_admin) {
    return {
      redirect: {
        destination: '/user/take-tests',
        permanent: false,
      },
    };
  }
  if (!user) {
    return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    };
  }

  return {
    props: {
      search: search || '',
      username: user ? user.username : null,
      isAdmin: user.is_admin,
      page,
      id: id ? (id as string) : null,
      selectedTest,
    },
  };
};
