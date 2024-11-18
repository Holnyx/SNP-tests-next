import React, { ChangeEvent, FC, memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/checkbox-icon.svg?url';

import s from './Checkbox.module.sass';
import cx from 'classnames';

type CheckboxItems = {
  title: string;
  type: string;
  name: string;
  leftCheck: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isChecked: boolean;
  id?: string;
};

const Checkbox: FC<CheckboxItems> = ({
  title,
  type,
  name,
  leftCheck,
  setIsChecked,
  isChecked,
  id,
}) => {
  const router = useRouter();
  const onValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.currentTarget.checked);
  };

  const changeStyleAdminCheckbox = router.pathname === '/signUp';

  return (
    <div
      className={cx(s.container, {
        [s['admin-container']]: changeStyleAdminCheckbox,
      })}
    >
      {leftCheck && (
        <label
          htmlFor={id}
          className={s.label}
        >
          {title}
        </label>
      )}
      <input
        className={cx(s['checkbox'], { [s['margin-right']]: title === '' })}
        type={type}
        id={id}
        name={name}
        checked={isChecked}
        onChange={onValueChanged}
      />
      {type === 'checkbox' && (
        <label
          htmlFor={id}
          className={cx(s['custom-checkbox'], {
            [s['admin-checkbox']]: changeStyleAdminCheckbox,
          })}
        >
          <Image
            src={starUrl}
            alt={'checkbox-icon'}
            priority
            className={cx(s['custom-checkbox-img'])}
          />
        </label>
      )}
      {!leftCheck && title !== '' && (
        <label
          htmlFor={id}
          className={cx(s.label, {
            [s['admin-label']]: changeStyleAdminCheckbox,
          })}
        >
          {title}
        </label>
      )}
    </div>
  );
};

export default memo(Checkbox);
