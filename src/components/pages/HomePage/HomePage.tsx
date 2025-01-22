import React, { memo, useState } from 'react';
import { useRouter } from 'next/router';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';

import s from './HomePage.module.sass';
import cx from 'classnames';
import Link from 'next/link';

const HomePage = () => {
  const router = useRouter();
  return (
    <div className={cx(s['home-page'])}>
      <div className={s.info}>
        <h2 className={s['home-page__title']}>Welcome to the Test</h2>
        <p className={s['home-page__info']}>here you can take tests</p>
        <div className={s['button-box-signin']}>
          <Link
            href="/signIn"
            className={s.button}
          >
            Sign In
          </Link>
          <Link
            href="/signUp"
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
