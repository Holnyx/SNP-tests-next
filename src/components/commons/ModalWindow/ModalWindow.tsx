import React, { FC, memo } from 'react';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

import s from './ModalWindow.module.sass';
import cx from 'classnames';

type ModalWindowItems = {
  isModalWindowOpen: boolean;
  setIsModalWindowOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  title: string;
};

const ModalWindow: FC<ModalWindowItems> = ({
  isModalWindowOpen,
  setIsModalWindowOpen,
  onConfirm,
  title,
}) => {
  useBodyScrollLock(isModalWindowOpen); //???? this work but I don't mind what this right

  return (
    <div
      className={cx(s.container, { [s.active]: isModalWindowOpen })}
      onClick={() => setIsModalWindowOpen(false)}
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
            onClick={() => setIsModalWindowOpen(false)}
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
              onClick={() => setIsModalWindowOpen(false)}
            />
            <ChangeButton
              title={'Yes'}
              onClick={() => {
                onConfirm();
                setIsModalWindowOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalWindow);
