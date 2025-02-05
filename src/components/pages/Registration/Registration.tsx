import React, { FC, memo, useCallback, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

import leafImage from '/public/img/logIn-img.jpeg';

import ButtonLog from '@/components/commons/Buttons/ButtonLog';
import Checkbox from '@/components/commons/Inputs/Checkbox/Checkbox';
import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';

import { AppDispatch } from '@/store';
import { signupThunk } from '@/thunk/authThunk';

import s from './Registration.module.sass';

type RegistrationProps = {
  url: string;
};

const Registration: FC<RegistrationProps> = ({ url }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [inputPasswordConfirmValue, setInputPasswordConfirmValue] =
    useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch<AppDispatch>();

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
    const resultAction = await dispatch(signupThunk(data));
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
            <InputForLogIn
              error={error}
              name={'password_confirmation'}
              setInputValue={setInputPasswordConfirmValue}
              title={'Password confirmation'}
              type={'password'}
              url={url}
              value={inputPasswordConfirmValue}
            />
            <Checkbox
              id={'1'}
              leftCheck={false}
              name={'selectTrue'}
              questionId={''}
              setIsChecked={setIsChecked}
              title={'Create an admin account'}
              type={'checkbox'}
            />
            <div className={s['button-box']}>
              <ButtonLog
                className={s.button}
                title={'Sign up'}
                onClick={() => {
                  onClickHandlerSignUp();
                }}
              />
              <span className={s['sign-up']}>
                Do you have an account?{' '}
                <Link
                  className={s.link}
                  href="/sign-in"
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
              className={s.button}
              href="/sign-in"
            >
              Sign In
            </Link>
          </div>
        )}
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

export default memo(Registration);
