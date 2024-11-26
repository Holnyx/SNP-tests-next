import React, { FC, memo } from 'react';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './DeleteButton.module.sass';
import cx from 'classnames';

type DeleteButtonItems = {
  onClick: () => void;
};

const DeleteButton: FC<DeleteButtonItems> = ({ onClick }) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClick();
    }
  };
  return (
    <button
      className={s.delete}
      title="Delete"
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Image
        src={deleteIconUrl}
        alt={'delete-icon'}
        className={s['delete-icon']}
      />
    </button>
  );
};

export default memo(DeleteButton);
