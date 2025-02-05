import React, { memo } from 'react';

import { useSelector } from 'react-redux';

import { deleteLoadingSelector } from '@/store/selectors';

import s from './Loader.module.sass';
import cx from 'classnames';

const Loader = () => {
  const deleteLoading = useSelector(deleteLoadingSelector);
  return (
    <div className={s.container}>
      {!deleteLoading && <div className={s.title}>Loading</div>}
      <div className={cx(s.loader, { [s['delete-test']]: deleteLoading })} />
    </div>
  );
};

export default memo(Loader);
