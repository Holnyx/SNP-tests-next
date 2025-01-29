import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';

import { AppDispatch } from '@/store';
import { getCurrentUser } from '@/thunk/testsThunk';

import s from './NotFound.module.sass';
import cx from 'classnames';

const NotFoundPage = () => {
  const [isHover, setIsHover] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const replaceAction = async () => {
    try {
      const resultAction = await dispatch(getCurrentUser());
      const user = resultAction.payload;

      if (user && user.is_admin) {
        router.replace('/admin/take-tests');
      } else if (user && !user.is_admin) {
        router.replace('/user/take-tests');
      } else {
        router.replace('/sign-in');
      }
    } catch {
      router.replace('/sign-in');
    }
  };

  return (
    <div className={cx(s['not-found-page'], { [s.hover]: isHover })}>
      <div className={s.info}>
        <h2 className={s['not-found-page__title']}>404</h2>
        <h2 className={s['not-found-page__info']}>Not Found</h2>
        <p className={s['not-found-page__info']}>
          Could not find requested resource
        </p>
        <ChangeButton
          title={'Return home'}
          onClick={replaceAction}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        />
      </div>
    </div>
  );
};

export default memo(NotFoundPage);
