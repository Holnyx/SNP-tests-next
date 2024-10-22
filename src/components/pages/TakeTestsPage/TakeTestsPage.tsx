import React, { memo } from 'react';

import s from './TakeTestsPage.module.sass';
import cx from 'classnames';
import DeleteButton from '@/components/commons/Buttons/DeleteButton/DeleteButton';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';

const TakeTestsPage = () => {
  return (
    <div className={s.container}>
      <h2 className={s.title}> Take Test</h2>
      <div className={s['tests-box']}>
        <div className={s.test}>
          <span>Test Name</span>
          <DeleteButton />
          <ChangeButton
            title={'Take the Test'}
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(TakeTestsPage);
