import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

import s from './ModalWindow.module.sass';
import cx from 'classnames';

type ModalWindowItems = {
  modalWindowIsOpen: boolean;
  titleModalWindow: string;
  setModalWindowIsOpen: () => void;
  setModalFunctionOnClick: React.Dispatch<React.SetStateAction<boolean>>;
};

const ModalWindow: FC<ModalWindowItems> = ({
  modalWindowIsOpen,
  titleModalWindow,
  setModalWindowIsOpen,
  setModalFunctionOnClick,
}) => {
  const router = useRouter();
  const replaceButton = router.pathname === '/admin/takeTests';
  const replaceButtonToTakeTest = router.pathname === '/admin/createTests';
  const onClickHandlerButtonForTakeTest = () => {
    if (replaceButton) {
      router.push('/admin/testPage');
    }
    if (replaceButtonToTakeTest) {
      router.push('/admin/takeTests');
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
              onClick={() => {
                setModalWindowIsOpen();
                setModalFunctionOnClick(false);
              }}
            />
            <ChangeButton
              title={'Yes'}
              onClick={() => {
                onClickHandlerButtonForTakeTest();
                setModalWindowIsOpen();
                setModalFunctionOnClick(true);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ModalWindow);
