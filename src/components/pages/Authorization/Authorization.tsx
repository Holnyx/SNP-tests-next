import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';
import leafImage from '/public/img/logIn-img.jpeg';
import ButtonLog from '@/components/commons/Buttons/ButtonLog';

import { AppDispatch } from '@/store';
import { signinThunk } from '@/thunk/authThunk';

import s from './Authorization.module.sass';
import cx from 'classnames';

type AuthorizationItems = {
  url: string;
};

const Authorization: FC<AuthorizationItems> = ({ url }) => {
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
            title={'User name'}
            type={'text'}
            name={'username'}
            setInputValue={setInputNameValue}
            error={error}
            value={inputNameValue}
            url={url}
          />
          <InputForLogIn
            title={'Password'}
            type={'password'}
            name={'password'}
            setInputValue={setInputPasswordValue}
            error={error}
            value={inputPasswordValue}
            url={url}
          />
          <div className={s['button-box']}>
            <ButtonLog
              title={'Sign in'}
              className={s.button}
              onClick={onClickHandlerSignUp}
            />
            <span className={s['sign-up']}>
              Don't have an account?{' '}
              <Link
                href="/sign-up"
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
