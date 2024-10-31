import React, { FC, memo, useState } from 'react';

import Input from '../Inputs/Input/Input';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';

import s from './QuestionBox.module.sass';
import cx from 'classnames';
import { QuestionItem } from '@/store/types';

type QuestionBoxItems = {
  question: QuestionItem[];
  takeTest: boolean;
};

const QuestionBox: FC<QuestionBoxItems> = ({ question, takeTest }) => {
  const [answerOption, setAnswerOption] = useState(false);

  return (
    <div className={s['questions-box']}>
      {question.map(question => {
        return (
          <div key={question.id}>
            <h3 className={s.title}>{question.title}</h3>
            <ul className={s['answer-list']}>
              {question.answer.map(answer => {
                return (
                  <li className={s['option']}>
                    <Input
                      title={answer.title}
                      type={question.questionType}
                      name={answer.name}
                      leftCheck={false}
                      setInputValue={() => {}}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {!question && answerOption && (
        <div className={s['test-title']}>
          <Input
            title={'Answer the question:'}
            type={'text'}
            name={'question'}
            leftCheck={true}
            setInputValue={() => {}}
          />

          <Input
            title={'Select true answer'}
            type={'checkbox'}
            name={'selectTrue'}
            leftCheck={false}
            setInputValue={() => {}}
          />
          <div className={s.buttons}>
            <ChangeButton
              title="Add answer"
              onClick={() => {}}
            />
          </div>
        </div>
      )}
      {!takeTest && (
        <div className={s.buttons}>
          <ChangeButton
            title={'Delete question'}
            onClick={() => {}}
          />
          <ChangeButton
            title={'Add answer'}
            onClick={() => {
              setAnswerOption(!answerOption);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default memo(QuestionBox);
