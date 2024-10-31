import React, { FC, memo, useState } from 'react';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './ModalWindow.module.sass';
import cx from 'classnames';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { useRouter } from 'next/router';

type ModalWindowItems = {
  modalWindowIsOpen: boolean;
  titleModalWindow: string;
  setModalWindowIsOpen: () => void;
};

const ModalWindow: FC<ModalWindowItems> = ({
  modalWindowIsOpen,
  titleModalWindow,
  setModalWindowIsOpen,
}) => {
  const router = useRouter();
  const replaceButton = router.pathname === '/admin/takeTests';
  const onClickHandlerButtonForTakeTest = () => {
    if (replaceButton) {
      router.push('/admin/testPage');
    }
  };

  useBodyScrollLock(modalWindowIsOpen); //???? this work but I don't mind what this right
  return (
    <div
      className={cx(s.container, { [s.active]: modalWindowIsOpen })}
      onClick={setModalWindowIsOpen}
    >
      <div
        className={s.window}
        onClick={e => e.stopPropagation()}
      >
        <h3 className={s.title}>{titleModalWindow}</h3>
        <div>
          <button
            className={s.closed}
            title="Cancel"
            onClick={setModalWindowIsOpen}
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
              onClick={setModalWindowIsOpen}
            />
            <ChangeButton
              title={'Yes'}
              onClick={() => {
                onClickHandlerButtonForTakeTest();
                setModalWindowIsOpen()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalWindow);
