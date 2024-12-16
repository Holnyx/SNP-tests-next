import { authErrorSelector, errorSelector } from '@/store/selectors';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './ErrorMessage.module.sass';
import cx from 'classnames';
import { useActionWithPayload } from '@/hooks/useAction';
import { clearError } from '@/store/testReduser';
import { AppRootStateItems } from '@/store';
import { removeError } from '@/store/authReducer';
import { useRouter } from 'next/router';

const ErrorMessage = () => {
  const router = useRouter();
  const testsErrors = useSelector(errorSelector);
  const authErrors = useSelector(authErrorSelector);
  const deleteError = useActionWithPayload(removeError);

  //auth errors
  useEffect(() => {
    if (authErrors.length > 0) {
      const timer = setTimeout(() => {
        deleteError(0);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authErrors, deleteError]);

  const test = router.pathname === '/signUp' || '/signIn';
  return (
    <div className={s['errors-boxes']}>
      {(test ? authErrors : testsErrors).map((error, index) => (
        <div
          key={index}
          className={cx(s['error-box'], { [s.show]: error })}
        >
          {error}
          <button
            className={s.button}
            onClick={() => deleteError(index)}
          >
            <Image
              src={deleteIconUrl}
              alt={'delete-icon'}
              className={s['delete-icon']}
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorMessage;
