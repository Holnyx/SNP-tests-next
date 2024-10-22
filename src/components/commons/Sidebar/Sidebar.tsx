import React, { FC, memo } from 'react';

import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';
import { sidebarLinksState } from '@/components/state/sidebarLinksState';

import s from './Sidebar.module.sass';
import cx from 'classnames';

type SidebarItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
};

const Sidebar: FC<SidebarItems> = ({ showSidebar, menuOpen }) => {
  return (
    <>
      <aside className={cx(s.container, { [s.show]: menuOpen })}>
        <ButtonBurgerMenu
          menuOpen={menuOpen}
          showSidebar={() => showSidebar(!menuOpen)}
        />
        <h3 className={s.title}>Test Management</h3>
        <ul className={s.menu}>
          {sidebarLinksState.map((element, i) => {
            return (
              <li>
                <a
                  href={element.href}
                  className={cx(s.link, {
                    [s['log-out']]: element.title === 'Log Out',
                  })}
                >
                  {element.title}
                </a>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default memo(Sidebar);
