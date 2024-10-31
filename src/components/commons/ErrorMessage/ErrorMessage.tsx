import { errorSelector } from '@/store/selectors';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './ErrorMessage.module.sass';
import cx from 'classnames';
import { useActionWithPayload } from '@/hooks/useAction';
import { removeErrorAC } from '@/store/actions';

const ErrorMessage = () => {
  const errors = useSelector(errorSelector);
  const deleteError = useActionWithPayload(removeErrorAC);

  return (
    <div className={s['errors-boxes']}>
      {errors.map((error, index) => (
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
