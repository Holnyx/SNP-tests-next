import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import leafImage from '/public/img/logIn-img.jpeg';
import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';
import ButtonLog from '@/components/commons/Buttons/ButtonLog';

import s from './Registration.module.sass';
import cx from 'classnames';
import Input from '@/components/commons/Inputs/Input/Input';

const Registration = () => {
  return (
    <div className={s.authorization}>
      <div className={s['login-form']}>
        <h2 className={s.title}>Sign Up</h2>
        <span className={s.info}>
          Enter your Credentials to access your account
        </span>
        <div className={s.form}>
          <InputForLogIn
            getTitle={'User name'}
            getType={'text'}
            getName={'username'}
            getClassName={s.input}
          />
          <InputForLogIn
            getTitle={'Password'}
            getType={'password'}
            getName={'password'}
            getClassName={s.input}
          />
          <InputForLogIn
            getTitle={'Password confirmation'}
            getType={'password'}
            getName={'password-confirmation'}
            getClassName={s.input}
          />
          <Input
            title={'Create an admin account'}
            type={'checkbox'}
            name={'selectTrue'}
            leftCheck={false}
          />
          <div className={s['button-box']}>
            <ButtonLog
              getTitle={'Sign up'}
              getClassName={s.button}
            />
            <span className={s['sign-up']}>
              Do you have an account?{' '}
              <Link
                href="/signIn"
                className={s.link}
              >
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div className={s['image-box']}>
        <Image
          className={s.image}
          src={leafImage}
          alt={'img-monstera-leafs'}
        />
      </div>
    </div>
  );
};

export default memo(Registration);
