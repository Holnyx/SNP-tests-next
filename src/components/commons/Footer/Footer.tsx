import React, { memo } from 'react';

import s from './Footer.module.sass';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <small className={s.small}>
        © 2025 Anastasia Smirnova, All Rights Reserved.
      </small>
    </footer>
  );
};

export default memo(Footer);
