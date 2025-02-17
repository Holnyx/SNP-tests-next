import React, { FC, memo, useCallback, useRef, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import ButtonLog from '@/components/commons/Buttons/ButtonLog';
import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';

import leafImage from '/public/img/logIn-img.jpeg';

import { AppDispatch } from '@/store';
import { signinThunk } from '@/thunk/authThunk';

import s from './Authorization.module.sass';

type AuthorizationProps = {
  url: string;
};

const Authorization: FC<AuthorizationProps> = ({ url }) => {
  const [error, setError] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const inputNameRef = useRef(inputNameValue);
  const inputPasswordRef = useRef(inputPasswordValue);

  inputNameRef.current = inputNameValue;
  inputPasswordRef.current = inputPasswordValue;

  const logInAction = async (data: { username: string; password: string }) => {
    const resultAction = await dispatch(signinThunk(data));
    if (signinThunk.fulfilled.match(resultAction)) {
      const user = resultAction.payload;
      if (user.is_admin) {
        router.replace('/admin/take-tests');
      } else {
        router.replace('/user/take-tests');
      }
    } else {
      setError(true);
    }
  };

  const onClickHandlerSignUp = useCallback(() => {
    logInAction({
      username: inputNameRef.current,
      password: inputPasswordRef.current,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.authorization}>
      <div className={s['login-form']}>
        <h2 className={s.title}>Sign In</h2>
        <span className={s.info}>
          Enter your Credentials to access your account
        </span>
        <div className={s.form}>
          <InputForLogIn
            error={error}
            name={'username'}
            setInputValue={setInputNameValue}
            title={'User name'}
            type={'text'}
            url={url}
            value={inputNameValue}
          />
          <InputForLogIn
            error={error}
            name={'password'}
            setInputValue={setInputPasswordValue}
            title={'Password'}
            type={'password'}
            url={url}
            value={inputPasswordValue}
          />
          <div className={s['button-box']}>
            <ButtonLog
              className={s.button}
              title={'Sign in'}
              onClick={onClickHandlerSignUp}
            />
            <span className={s['sign-up']}>
              Don&apos;t have an account?{' '}
              <Link
                className={s.link}
                href="/sign-up"
              >
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
      <div className={s['image-box']}>
        <Image
          alt={'img-monstera-leafs'}
          className={s.image}
          src={leafImage}
        />
      </div>
    </div>
  );
};

export default memo(Authorization);
