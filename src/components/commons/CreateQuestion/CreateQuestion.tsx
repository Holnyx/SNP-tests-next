import React, { ChangeEvent, FC, memo } from 'react';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import Input from '@/components/commons/Inputs/Input/Input';
import SelectField from '@/components/commons/SelectField/SelectField';
import { testsOptions } from '@/components/state/testsOptions';

import s from './CreateQuestion.module.sass';
import cx from 'classnames';

type CreateQuestionProps = {
  saveQuestionClickHandler: () => void;
  error: boolean;
  setSelectType: (v: string) => void;
  questionInputValue: string | undefined;
  seQuestionInputValue: (e: string) => void;
  setSelect: (v: string) => void;
  select: string;
};

const CreateQuestion: FC<CreateQuestionProps> = ({
  saveQuestionClickHandler,
  error,
  setSelectType,
  questionInputValue,
  seQuestionInputValue,
  select,
  setSelect,
}) => {
  return (
    <div className={cx(s['test-title'])}>
      <Input
        error={error}
        leftCheck={true}
        name={'questionTitle'}
        title={'Question Title:'}
        type={'text'}
        value={questionInputValue}
        onChange={seQuestionInputValue}
      />
      <SelectField
        defaultValue={select}
        directionOptions={testsOptions}
        error={error}
        setSelect={setSelect}
        onChange={setSelectType}
      />
      <ChangeButton
        title={'Add question'}
        onClick={saveQuestionClickHandler}
      />
    </div>
  );
};

export default memo(CreateQuestion);
