import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import leafImage from '/public/img/logIn-img.jpeg';
import InputForLogIn from '@/components/commons/Inputs/InputForLogIn';
import ButtonLog from '@/components/commons/Buttons/ButtonLog';
import Input from '@/components/commons/Inputs/Input/Input';

import s from './Registration.module.sass';
import cx from 'classnames';
import Checkbox from '@/components/commons/Inputs/Checkbox/Checkbox';

const Registration = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [inputNameValue, setInputNameValue] = useState('');
  const [inputPasswordValue, setInputPasswordValue] = useState('');
  const [inputPasswordConfirmValue, setInputPasswordConfirmValue] =
    useState('');

  const checkNameValue =
    inputNameValue.length >= 3 && inputNameValue.trim() !== ''

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
        <h2 className={s.title}>Sign Up</h2>
        <span className={s.info}>
          Enter your Credentials to access your account
        </span>
        <div className={s.form}>
          <InputForLogIn
            getTitle={'User name'}
            getType={'text'}
            getName={'username'}
            error={error}
            value={inputNameValue}
            setInputValue={setInputNameValue}
          />
          <InputForLogIn
            getTitle={'Password'}
            getType={'password'}
            getName={'password'}
            error={error}
            value={inputPasswordValue}
            setInputValue={setInputPasswordValue}
          />
          <InputForLogIn
            getTitle={'Password confirmation'}
            getType={'password'}
            getName={'password-confirmation'}
            error={error}
            value={inputPasswordConfirmValue}
            setInputValue={setInputPasswordConfirmValue}
            inputPasswordValue={inputPasswordValue}
          />
          <Checkbox
            title={'Create an admin account'}
            type={'checkbox'}
            name={'selectTrue'}
            leftCheck={false}
            setIsChecked={setIsChecked}
            isChecked={isChecked}
            id={'1'}
          />
          <div className={s['button-box']}>
            <ButtonLog
              getTitle={'Sign up'}
              getClassName={s.button}
              onClick={onClickHandlerSignUp}
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
