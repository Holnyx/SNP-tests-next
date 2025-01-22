import React, { FC, memo } from 'react';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

import s from './ModalWindow.module.sass';
import cx from 'classnames';

type ModalWindowItems = {
  isModalWindowOpen: boolean;
  onConfirm: () => void;
  title: string;
  onClose: () => void;
};

const ModalWindow: FC<ModalWindowItems> = ({
  isModalWindowOpen,
  onConfirm,
  title,
  onClose,
}) => {
  useBodyScrollLock(isModalWindowOpen); //???? this work but I don't mind what this right

  return (
    <div
      className={cx(s.container, { [s.active]: isModalWindowOpen })}
      onClick={onClose}
    >
      <div
        className={s.window}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={s.title}>{title}</h3>
        <div>
          <button
            className={s.closed}
            title="Cancel"
            onClick={onClose}
          >
            <Image
              className={s['closed-img']}
              src={deleteIconUrl}
              alt={'Clear'}
            />
          </button>
          <div className={s['buttons_box']}>
            <ChangeButton
              title={'Cancel'}
              onClick={onClose}
            />
            <ChangeButton
              title={'Yes'}
              onClick={() => {
                onConfirm();
                onClose
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalWindow);
