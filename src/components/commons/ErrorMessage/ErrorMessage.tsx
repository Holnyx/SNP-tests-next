import React, { memo, useEffect } from 'react';

import Image from 'next/image';
import { useSelector } from 'react-redux';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import { useActionWithPayload } from '@/hooks/useAction';
import { removeError } from '@/store/authReducer';
import { authErrorSelector, errorSelector } from '@/store/selectors';
import { clearError } from '@/store/testReducer';

import s from './ErrorMessage.module.sass';
import cx from 'classnames';

const ErrorMessage = () => {
  const testsErrors = useSelector(errorSelector);
  const authErrors = useSelector(authErrorSelector);
  const deleteAuthError = useActionWithPayload(removeError);
  const deleteTestsError = useActionWithPayload(clearError);

  //auth errors
  useEffect(() => {
    if (authErrors.length > 0 || testsErrors.length > 0) {
      const timer = setTimeout(() => {
        if (authErrors.length > 0) {
          deleteAuthError(0);
        }
        if (testsErrors.length > 0) {
          deleteTestsError(0);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [authErrors, testsErrors, deleteAuthError, deleteTestsError]);

  return (
    <div className={s['errors-boxes']}>
      {[...authErrors, ...testsErrors].map((error, index) => (
        <div
          key={index}
          className={cx(s['error-box'], { [s.show]: error })}
        >
          {error}
          <button
            className={s.button}
            onClick={() => {
              deleteAuthError(index);
              deleteTestsError(index);
            }}
          >
            <Image
              alt={'delete-icon'}
              className={s['delete-icon']}
              src={deleteIconUrl}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default memo(ErrorMessage);
