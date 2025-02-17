import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Input.module.sass';
import cx from 'classnames';

type InputProps = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  value?: string;
  id?: string;
  error?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onChange: (e: string) => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  isHidden?: boolean;
};

const Input: FC<InputProps> = ({
  title,
  type,
  name,
  leftCheck,
  value,
  id,
  error,
  onKeyDown,
  onChange,
  onBlur,
  autoFocus,
  isHidden,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const onValueChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  useEffect(() => {
    setErrorMessage('');
    if (
      (!value && error) ||
      (value && value.length < 3 && title.includes('Title'))
    ) {
      setErrorMessage('The title must contain more than 2 characters');
    } else if (
      (value && value.length < 1) ||
      (value === '' && error && title.includes('Answer'))
    ) {
      setErrorMessage('The answer must contain from 1 to 30 characters');
    } else if (
      value &&
      value.length > 30 &&
      (title.includes('Title') || title.includes('Answer'))
    ) {
      setErrorMessage('The answer must not exceed 30 characters');
    }
  }, [value, error, title]);

  const changeStyle =
    type === 'checkbox'
      ? s['checkbox']
      : type === 'radio'
        ? s['radio']
        : s.input;

  const changeStyleAdminCheckbox = router.pathname === '/sign-up';

  return (
    <div
      className={cx(s.container, {
        [s['admin-container']]: changeStyleAdminCheckbox,
        [s['change-title']]: isHidden,
      })}
    >
      {type !== 'radio' && (
        <>
          {leftCheck && (
            <label
              className={s.label}
              htmlFor={id}
            >
              {title}
            </label>
          )}
          <input
            autoFocus={autoFocus}
            className={cx(changeStyle)}
            id={id}
            name={name}
            type={type}
            value={value}
            onBlur={onBlur}
            onChange={onValueChanged}
            onKeyDown={onKeyDown}
          />
          {errorMessage && (
            <span className={cx(s['error-message'])}>{errorMessage}</span>
          )}
        </>
      )}

      {type === 'checkbox' && (
        <label
          className={cx(s['custom-checkbox'], {
            [s['admin-checkbox']]: changeStyleAdminCheckbox,
          })}
          htmlFor={id}
        >
          <Image
            priority
            alt={'checkbox-icon'}
            className={cx(s['custom-checkbox-img'])}
            src={starUrl}
          />
        </label>
      )}
      {type === 'radio' && (
        <>
          <input
            className={s['real-radio']}
            id={id}
            name={name}
            type="radio"
          />
          <label
            className={s['custom-radio']}
            htmlFor={id}
          />
        </>
      )}
      {!leftCheck && title !== '' && (
        <label
          className={cx(s.label, {
            [s['admin-label']]: changeStyleAdminCheckbox,
          })}
          htmlFor={id}
        >
          {title}
        </label>
      )}
    </div>
  );
};

export default memo(Input);
