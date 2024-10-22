import React, { FC, memo } from 'react';

import s from './ChangeButton.module.sass';
import cx from 'classnames';

type ChangeButtonItems = {
  title: string;
  onClick: () => void;
};

const ChangeButton: FC<ChangeButtonItems> = ({ title, onClick }) => {
  return (
    <button
      className={cx(s.button, {
        [s['delete-button']]: title.includes('Delete'),
      })}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default memo(ChangeButton);
