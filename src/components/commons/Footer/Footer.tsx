import React from 'react';

import s from './Footer.module.sass';
import cx from 'classnames';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <small className={s.small}>
        © 2025 Anastasia Smirnova, All Rights Reserved.
      </small>
    </footer>
  );
};

export default Footer;
