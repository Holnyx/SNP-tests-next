import React, { memo } from 'react';
import Link from 'next/link';

import s from './HomePage.module.sass';
import cx from 'classnames';

const HomePage = () => {
  return (
    <div className={cx(s['home-page'])}>
      <div className={s.info}>
        <h2 className={s['home-page__title']}>Welcome to the Test</h2>
        <p className={s['home-page__info']}>here you can take tests</p>
        <div className={s['button-box-signin']}>
          <Link
            href="/sign-in"
            className={s.button}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={s.button}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
