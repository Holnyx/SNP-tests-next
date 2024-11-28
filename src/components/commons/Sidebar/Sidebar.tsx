import React, { FC, memo } from 'react';
import Link from 'next/link';

import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';
import { sidebarLinksState } from '@/components/state/sidebarLinksState';

import s from './Sidebar.module.sass';
import cx from 'classnames';
import { useRouter } from 'next/router';

type SidebarItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  user?: string;
};

const Sidebar: FC<SidebarItems> = ({ showSidebar, menuOpen, user }) => {
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    if (href === '/signIn') {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  return (
    <aside
      className={cx(s.container, { [s.show]: menuOpen })}
      onClick={e => e.stopPropagation()}
    >
      <ButtonBurgerMenu
        menuOpen={menuOpen}
        showSidebar={() => showSidebar(!menuOpen)}
      />
      <h3 className={s.title}>Test Management</h3>
      <ul className={s.menu}>
        {sidebarLinksState
          .filter(
            element => !(element.title === 'Create Tests' && user === 'user')
          )
          .map((element, i) => {
            const href =
              element.title !== 'Log Out'
                ? `/${user}${element.href}`
                : '/signIn';

            return (
              <li key={i}>
                <Link
                  className={cx(s.link, {
                    [s['log-out']]: element.title === 'Log Out',
                  })}
                  href={href}
                  onClick={e => {
                    e.preventDefault();
                    handleLinkClick(href);
                  }}
                >
                  {element.title}
                </Link>
              </li>
            );
          })}
      </ul>
    </aside>
  );
};

export default memo(Sidebar);
