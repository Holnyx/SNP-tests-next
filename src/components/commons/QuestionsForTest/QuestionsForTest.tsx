import React, { FC, memo, useEffect, useState } from 'react';

import AnswerBox from '../AnswerBox/AnswerBox';
import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';

import s from './QuestionsForTest.module.sass';

type QuestionForTestProps = {
  question: QuestionItem;
  takeTest: boolean;
  onAnswerSelect: (args: OnAnswerSelectArgs) => void;
};

const QuestionForTest: FC<QuestionForTestProps> = ({
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
    </div>
  );
};

export default memo(QuestionForTest);
