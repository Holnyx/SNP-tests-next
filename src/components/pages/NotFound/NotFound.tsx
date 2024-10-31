import React, { memo, useState } from 'react';

import s from './NotFound.module.sass';
import cx from 'classnames';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import { useRouter } from 'next/router';

const NotFoundPage = () => {
  const [isHover, setIsHover] = useState(false);
  const router = useRouter();
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
          onClick={() => {
            router.push('/');
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        />
      </div>
    </div>
  );
};

export default memo(NotFoundPage);
