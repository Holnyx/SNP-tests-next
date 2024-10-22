import React, { memo, useState } from 'react';

import { testsOptions } from '@/components/state/testsOptions';

import SelectField from '@/components/commons/SelectField/SelectField';
import Input from '@/components/commons/Inputs/Input/Input';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import s from './CreateTests.module.sass';
import cx from 'classnames';


const CreateTests = () => {
  const [select, setSelect] = useState('disabled');
  const [addQuestion, setAddQuestion] = useState(false);
  const [answerOption, setAnswerOption] = useState(false);
  return (
    <div className={s.container}>
      <h2 className={s.title}> Create Test</h2>
      <div className={s.form}>
        <div className={s['test-title']}>
          <Input
            title={'Test Title:'}
            type={'text'}
            name={'name'}
            leftCheck={true}
          />
          <ChangeButton
            title={!addQuestion ? ' Add question' : 'Hide'}
            onClick={() => setAddQuestion(!addQuestion)}
          />
        </div>
        {addQuestion && (
          <div className={s['test-title']}>
            <Input
              title={'Question Title:'}
              type={'text'}
              name={'questionTitle'}
              leftCheck={true}
            />
            <ChangeButton
              title={!answerOption ? 'Add answer ' : 'Hide'}
              onClick={() => setAnswerOption(!answerOption)}
            />
            {answerOption && (
              <ChangeButton
                title="Add question"
                onClick={() => {}}
              />
            )}
          </div>
        )}
        {addQuestion && answerOption && (
          <>
            <div className={s['test-title']}>
              <Input
                title={'Answer the question:'}
                type={'text'}
                name={'question'}
                leftCheck={true}
              />

              <SelectField
                defaultValue={select}
                directionOptions={testsOptions}
                setSelect={setSelect}
              />
              <Input
                title={'Select true answer'}
                type={'checkbox'}
                name={'selectTrue'}
                leftCheck={false}
              />
            </div>
            <div className={s.buttons}>
              <ChangeButton
                title="Add answer"
                onClick={() => {}}
              />
            </div>
          </>
        )}
        <QuestionBox />
        <QuestionBox />
        <QuestionBox />
        <QuestionBox />
        <div className={s.buttons}>
          <ChangeButton
            title="Delete Test"
            onClick={() => {}}
          />
          <ChangeButton
            title="Save Test"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CreateTests);
