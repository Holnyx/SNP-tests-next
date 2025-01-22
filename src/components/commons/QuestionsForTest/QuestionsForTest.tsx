import React, { FC, memo, useEffect, useState } from 'react';
import { Reorder } from 'motion/react';

import AnswerBox from '../AnswerBox/AnswerBox';
import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';

import s from './QuestionsForTest.module.sass';
import cx from 'classnames';

type QuestionForTestItems = {
  question: QuestionItem;
  takeTest: boolean;
  onAnswerSelect: (args: OnAnswerSelectArgs) => void;
};

const QuestionForTest: FC<QuestionForTestItems> = ({
  question,
  takeTest,
  onAnswerSelect,
}) => {
  const [answerState, setAnswerState] = useState<AnswerItem[]>(
    question.answers
  );

  useEffect(() => {
    setAnswerState(question.answers);
  }, [question.answers]);

  return (
    <div className={s['questions-box']}>
      <Reorder.Group
        values={answerState}
        onReorder={() => {}}
        className={cx(s['answer-list'])}
      >
        {answerState.map(answer => {
          return (
            <AnswerBox
              key={answer.id}
              question={question}
              takeTest={takeTest}
              onAnswerSelect={onAnswerSelect}
              answer={answer}
              pathRouteEdit={false}
            />
          );
        })}
      </Reorder.Group>
    </div>
  );
};

export default memo(QuestionForTest);
