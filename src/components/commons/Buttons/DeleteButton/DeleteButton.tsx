import React, { memo } from 'react';
import Image from 'next/image';

import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './DeleteButton.module.sass';
import cx from 'classnames';

const DeleteButton = () => {
    return (
        <button
        className={s.delete}
        title="Delete"
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