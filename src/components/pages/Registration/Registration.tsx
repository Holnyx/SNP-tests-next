import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

import leafImage from '/public/img/logIn-img.jpeg';
import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';
import ButtonLog from '@/components/commons/Buttons/ButtonLog';
import Checkbox from '@/components/commons/Inputs/Checkbox/Checkbox';

import { AppDispatch } from '@/store';
import { signupThunk } from '@/thunk/authThunk';

import s from './Registration.module.sass';
import cx from 'classnames';

type RegistrationItems = {
  url: string;
};

const Registration: FC<RegistrationItems> = ({ url }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [inputPasswordConfirmValue, setInputPasswordConfirmValue] =
    useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();

  const authorizationAction = (data: {
    username: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
  }) => {
    dispatch(signupThunk(data));
  };

  const checkNameValue =
    inputNameValue.length >= 3 && inputNameValue.trim() !== '';

  const isPasswordValid =
    inputPasswordValue.length >= 6 && inputPasswordValue.trim() !== '';

  const registrationInAction = async (data: {
    username: string;
    password: string;
    password_confirmation: string;
    is_admin: boolean;
  }) => {
    const resultAction = await authorizationAction(data);
    if (signupThunk.fulfilled.match(resultAction)) {
      setSuccessMessage('Registration was successful');
    } else {
      setError(true);
    }
  };

  const onClickHandlerSignUp = useCallback(() => {
    if (checkNameValue && isPasswordValid) {
      registrationInAction({
        username: inputNameValue,
        password: inputPasswordValue,
        password_confirmation: inputPasswordConfirmValue,
        is_admin: isChecked,
      });
      setError(false);
    } else {
      setError(true);
    }
  }, [checkNameValue, isPasswordValid, registrationInAction]);

  return (
    <div className={s.authorization}>
      <div className={s['login-form']}>
        <h2 className={s.title}>Sign Up</h2>
        {successMessage ? (
          <span className={s.info}>{successMessage}</span>
        ) : (
          <span className={s.info}>
            Enter your Credentials to access your account
          </span>
        )}
        {!successMessage && (
          <div className={s.form}>
            <InputForLogIn
              title={'User name'}
              type={'text'}
              name={'username'}
              error={error}
              value={inputNameValue}
              setInputValue={setInputNameValue}
              url={url}
            />
            <InputForLogIn
              title={'Password'}
              type={'password'}
              name={'password'}
              error={error}
              value={inputPasswordValue}
              setInputValue={setInputPasswordValue}
              url={url}
            />
            <InputForLogIn
              title={'Password confirmation'}
              type={'password'}
              name={'password_confirmation'}
              error={error}
              value={inputPasswordConfirmValue}
              setInputValue={setInputPasswordConfirmValue}
              inputPasswordValue={inputPasswordValue}
              url={url}
            />
            <Checkbox
              title={'Create an admin account'}
              type={'checkbox'}
              name={'selectTrue'}
              leftCheck={false}
              id={'1'}
              onAnswerSelect={() => {}}
              questionId={''}
              setIsChecked={setIsChecked}
            />
            <div className={s['button-box']}>
              <ButtonLog
                title={'Sign up'}
                className={s.button}
                onClick={() => {
                  onClickHandlerSignUp();
                }}
              />
              <span className={s['sign-up']}>
                Do you have an account?{' '}
                <Link
                  href="/sign-in"
                  className={s.link}
                >
                  Sign In
                </Link>
              </span>
            </div>
          </div>
        )}
        {successMessage && (
          <div className={s['button-box-signin']}>
            <Link
              href="/signIn"
              className={s.button}
            >
              Sign In
            </Link>
          </div>
        )}
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
