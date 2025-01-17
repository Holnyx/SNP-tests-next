import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';

import { AnswerItem, TestsItem } from '@/store/types';

import s from './TestPage.module.sass';
import cx from 'classnames';

type TestPageItems = {
  user?: string;
  id?: string;
  selectedTestItem: TestsItem;
};

const TestPage: FC<TestPageItems> = ({ user, id, selectedTestItem }) => {
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [isModalWindowTitle, setIsModalWindowTitle] = useState('');
  const [nextHref, setNextHref] = useState<string | null>(null);
  const [questions, setQuestions] = useState(selectedTestItem.questions);
  const [correctAnswers, setCorrectAnswers] = useState<AnswerItem[]>([]);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<AnswerItem[]>(
    []
  );
  const [completeTest, setCompleteTest] = useState(false);
  const [correctUserAnswers, setCorrectUserAnswers] = useState(0);

  const router = useRouter();
  const pathRouteTakeTest = router.pathname.startsWith(`/${user}/testPage`);

  const onConfirm = useCallback(() => {
    setIsModalWindowOpen(false);
    if (nextHref) {
      router.push(nextHref);
      setNextHref(null);
    }
    if (isModalWindowTitle.includes('complete')) {
      let correctUserAnswers = 0;
      userSelectedAnswers.forEach(userAnswer => {
        const correctAnswer = correctAnswers.find(
          answer => answer.id === userAnswer.id
        );
        if (correctAnswer) {
          // For number answers
          if (isNaN(Number(correctAnswer.text))) {
            // For other answers
            if (correctAnswer.id === userAnswer.id) {
              correctUserAnswers++;
            }
          } else {
            // For number answers check for have`value` in userAnswer
            if ('value' in userAnswer) {
              if (Number(correctAnswer.text) === (userAnswer as any).value) {
                correctUserAnswers++;
              }
            }
          }
        }
      });
      setCompleteTest(true);
      setCorrectUserAnswers(correctUserAnswers);
    }
  }, [
    nextHref,
    router,
    userSelectedAnswers,
    correctAnswers,
    isModalWindowTitle,
  ]);
  console.log(user);

  const handleAnswerSelect = (
    selectedAnswer: AnswerItem,
    type: string,
    inputNumberValue: number,
    isChecked: boolean,
    questionId: string
  ) => {
    setUserSelectedAnswers(prevSelectedAnswers => {
      if (type === 'number') {
        const isAnswerCorrect =
          Number(selectedAnswer.text) === inputNumberValue;
        const updatedAnswer = {
          ...selectedAnswer,
          value: inputNumberValue,
          isCorrect: isAnswerCorrect,
        };

        return prevSelectedAnswers.some(
          answer => answer.id === updatedAnswer.id
        )
          ? prevSelectedAnswers.map(answer =>
              answer.id === updatedAnswer.id ? updatedAnswer : answer
            )
          : [...prevSelectedAnswers, updatedAnswer];
      } else if (type === 'multiple') {
        // For checkbox
        if (isChecked) {
          return [...prevSelectedAnswers, selectedAnswer];
        } else {
          return prevSelectedAnswers.filter(
            answer => answer.id !== selectedAnswer.id
          );
        }
      } else if (type === 'single') {
        // For radio
        return [
          ...prevSelectedAnswers.filter(
            answer => answer.questionId !== questionId
          ),
          { ...selectedAnswer, questionId },
        ];
      } else {
        // For other answers
        return prevSelectedAnswers.some(
          answer => answer.id === selectedAnswer.id
        )
          ? prevSelectedAnswers
          : [...prevSelectedAnswers, selectedAnswer];
      }
    });
  };
  const handleLinkClick = useCallback(
    (href: string) => {
      if (!completeTest && pathRouteTakeTest) {
        setNextHref(href);
        setIsModalWindowOpen(true);
      }
      if (completeTest && pathRouteTakeTest) {
        router.push(href);
      }
    },
    [completeTest, pathRouteTakeTest]
  );

  const onClickHandlerCompleteTest = useCallback(() => {
    setIsModalWindowTitle('Are you sure you want to complete the test?');
    setIsModalWindowOpen(true);
  }, [setIsModalWindowTitle, setIsModalWindowOpen]);

  useEffect(() => {
    const correct = questions.flatMap(question =>
      question.answers.filter(answer => answer.is_right)
    );
    setCorrectAnswers(correct);
    setQuestions(selectedTestItem.questions);
  }, [questions]);

  return (
    <div className={s.container}>
      <div className={s['test-title']}> {selectedTestItem.title}</div>
      {!completeTest &&
        selectedTestItem &&
        selectedTestItem.questions.map(test => {
          return (
            <div key={test.id}>
              <h2 className={s.title}>{test.title}</h2>
              <QuestionBox
                question={test}
                takeTest={pathRouteTakeTest}
                questionId={''}
                removeQuestionHandler={() => {}}
                questions={selectedTestItem.questions}
                onAnswerSelect={handleAnswerSelect}
              />
            </div>
          );
        })}
      {completeTest && (
        <>
          <div>Correct answers:</div>
          <div>
            {correctUserAnswers} from {correctAnswers.length}
          </div>
        </>
      )}

      <div className={s['buttons-box']}>
        {!completeTest ? (
          <>
            {' '}
            <ChangeButton
              title={'Go Back'}
              onClick={() => {
                handleLinkClick(`/${user}/takeTests`);
              }}
            />
            <ChangeButton
              title={'Complete'}
              onClick={() => {
                onClickHandlerCompleteTest();
              }}
            />
          </>
        ) : (
          <>
            <ChangeButton
              title={'Go Back'}
              onClick={() => {
                handleLinkClick(`/${user}/takeTests`);
              }}
            />
            <ChangeButton
              title={'Try again'}
              onClick={() => {
                router.reload();
              }}
            />
          </>
        )}
      </div>

      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        setIsModalWindowOpen={setIsModalWindowOpen}
        onConfirm={onConfirm}
        title={
          'Are you sure you want to leave the page without complete the test?'
        }
      />
    </div>
  );
};

export default memo(TestPage);
