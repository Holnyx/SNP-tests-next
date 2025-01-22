import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import ButtonBurgerMenu from '../Buttons/ButtonBurgerMenu/ButtonBurgerMenu';
import ModalWindow from '../ModalWindow/ModalWindow';

import { sidebarLinksState } from '@/components/state/sidebarLinksState';
import { questionSelector } from '@/store/selectors';

import { AppDispatch } from '@/store';
import { useActionWithPayload } from '@/hooks/useAction';
import { removeAllQuestion } from '@/store/questionReducer';

import s from './Sidebar.module.sass';
import cx from 'classnames';
import { logoutThunk } from '@/thunk/authThunk';

type SidebarItems = {
  showSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  menuOpen: boolean;
  user?: string;
};

const Sidebar: FC<SidebarItems> = ({ showSidebar, menuOpen, user }) => {
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [nextHref, setNextHref] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const allQuestions = useSelector(questionSelector);
  const removeAllQuestionAction = useActionWithPayload(removeAllQuestion);

  const handleLinkClick = (href: string) => {
    if (
      router.pathname === '/admin/create-tests' &&
      allQuestions.questionsList.length > 0
    ) {
      setNextHref(href);
      setIsModalWindowOpen(true);
    } else if (href === '/sign-in') {
      dispatch(logoutThunk())
        .unwrap()
        .then(() => {
          router.replace(href);
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    } else {
      router.replace(href);
    }
  };

  const onConfirm = useCallback(() => {
    removeAllQuestionAction();
    setIsModalWindowOpen(false);
    if (nextHref) {
      router.replace(nextHref);
      setNextHref(null);
    }
  }, [nextHref, router]);

  useEffect(() => {
    const handleBeforePopState = (state: { url: string }) => {
      if (router.pathname === '/admin/create-tests') {
        setNextHref(state.url);
        setIsModalWindowOpen(true);
        return false;
      }
      return true;
    };
    router.beforePopState(handleBeforePopState);
    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  return (
    <>
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
                  : '/sign-in';

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
      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        onConfirm={onConfirm}
        title={'Are you sure you want to leave without saving?'}
        onClose={() => setIsModalWindowOpen(false)}
      />
    </>
  );
};

export default memo(Sidebar);
