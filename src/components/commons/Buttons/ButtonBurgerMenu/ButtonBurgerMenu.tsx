import React, { FC, memo, useState } from 'react';

import s from './ButtonBurgerMenu.module.sass';
import cx from 'classnames';

type ButtonBurgerMenuItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
};

const ButtonBurgerMenu: FC<ButtonBurgerMenuItems> = ({
  showSidebar,
  menuOpen,
}) => {
  return (
    <button
      className={cx(s['burger-menu-button'], {
        [s['burger-menu__click']]: menuOpen,
      })}
      onClick={() => showSidebar(!menuOpen)}
    >
      <span
        className={cx(s['burger-menu'], {
          [s['burger-menu__click']]: menuOpen,
        })}
      />
    </button>
  );
};

export default memo(ButtonBurgerMenu);
