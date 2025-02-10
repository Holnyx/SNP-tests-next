import React, { FC, memo } from 'react';

import s from './ChangeButton.module.sass';
import cx from 'classnames';

type ChangeButtonProps = {
  title: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  disabled?: boolean;
};

const ChangeButton: FC<ChangeButtonProps> = ({
  title,
  onClick,
  onMouseEnter,
  onMouseLeave,
  disabled,
}) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClick();
    }
  };
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
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title}
    </button>
  );
};

export default memo(ChangeButton);
