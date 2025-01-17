import React, { FC, memo } from 'react';

import s from './ChangeButton.module.sass';
import cx from 'classnames';

type ChangeButtonItems = {
  title: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const ChangeButton: FC<ChangeButtonItems> = ({
  title,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClick()
    }
  }
  const notFoundStyle = { [s['return-home']]: title.includes('Return home') };
  return (
    <button
      className={cx(
        s.button,
        {
          [s['delete-button']]:
            title.includes('Delete') || title.includes('Cancel'),
        },
        notFoundStyle
      )}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
    >
      {title}
    </button>
  );
};

export default memo(ChangeButton);
