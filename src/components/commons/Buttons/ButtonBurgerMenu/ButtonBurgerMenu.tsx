import React, { FC, memo } from 'react';

import s from './ButtonBurgerMenu.module.sass';
import cx from 'classnames';

type ButtonBurgerMenuProps = {
  showSidebar: (v: boolean) => void;
  menuOpen: boolean;
};

const ButtonBurgerMenu: FC<ButtonBurgerMenuProps> = ({
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
