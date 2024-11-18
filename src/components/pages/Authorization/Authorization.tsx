import React, { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';
import leafImage from '/public/img/logIn-img.jpeg';
import ButtonLog from '@/components/commons/Buttons/ButtonLog';

import s from './Authorization.module.sass';
import cx from 'classnames';

const Authorization = () => {
  const [error, setError] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');

  const checkNameValue =
    inputNameValue.length >= 3 && inputNameValue.trim() !== '';

  const checkPasswordValue =
    inputPasswordValue.length >= 5 && inputPasswordValue.trim() !== '';

  const onClickHandlerSignUp = useCallback(() => {
    if (checkNameValue) {
      setError(true);
    } else {
      setError(true);
    }

    if (checkPasswordValue) {
      setError(false);
    } else {
      setError(true);
    }
  }, [checkNameValue, checkPasswordValue]);

  return (
    <div className={s.authorization}>
      <div className={s['login-form']}>
        <h2 className={s.title}>Sign In</h2>
        <span className={s.info}>
          Enter your Credentials to access your account
        </span>
        <div className={s.form}>
          <InputForLogIn
            getTitle={'User name'}
            getType={'text'}
            getName={'username'}
            setInputValue={setInputNameValue}
            error={error}
            value={inputNameValue}
          />
          <InputForLogIn
            getTitle={'Password'}
            getType={'password'}
            getName={'password'}
            setInputValue={setInputPasswordValue}
            error={error}
            value={inputPasswordValue}
          />
          <div className={s['button-box']}>
            <ButtonLog
              getTitle={'Sign in'}
              getClassName={s.button}
              onClick={onClickHandlerSignUp}
            />
            <span className={s['sign-up']}>
              Don't have an account?{' '}
              <Link
                href="/signUp"
                className={s.link}
              >
                Sign Up
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

export default memo(Authorization);
