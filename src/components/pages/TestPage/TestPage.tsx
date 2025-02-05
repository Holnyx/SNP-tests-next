import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import QuestionsForTest from '@/components/commons/QuestionsForTest/QuestionsForTest';

import { useModal } from '@/hooks/useModal';
import { AnswerItem, OnAnswerSelectArgs, TestsItem } from '@/store/types';

import s from './TestPage.module.sass';

type TestPageProps = {
  user?: string;
  selectedTestItem: TestsItem | null;
  pathRouteTakeTest: boolean;
};

const TestPage: FC<TestPageProps> = ({
  user,
  selectedTestItem,
  pathRouteTakeTest,
}) => {
  const [nextHref, setNextHref] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<
    AnswerItem[] | undefined
  >([]);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<AnswerItem[]>(
    []
  );
  const [completeTest, setCompleteTest] = useState(false);
  const [correctUserAnswers, setCorrectUserAnswers] = useState(0);
  const { isModalOpen, modalTitle, openModal, closeModal } = useModal();

  const router = useRouter();
  const retryTest = useCallback(() => {
    setUserSelectedAnswers([]);
    setCompleteTest(false);
    setCorrectUserAnswers(0);
    router.replace(router.asPath);
  }, []);

  const onConfirm = useCallback(() => {
    closeModal();
    if (nextHref) {
      router.replace(nextHref);
      setNextHref(null);
    }
    if (modalTitle.includes('complete')) {
      let correctUserAnswers = 0;
      userSelectedAnswers.forEach(userAnswer => {
        const correctAnswer = correctAnswers?.find(
          answer => answer.id === userAnswer.id
        );
        if (correctAnswer) {
          if (
            correctAnswer.is_right === userAnswer.is_right &&
            !('value' in userAnswer)
          ) {
            correctUserAnswers++;
          }
          // For number answers check for have`value` in userAnswer
          else if (
            'value' in userAnswer &&
            userAnswer.value === Number(correctAnswer.text)
          ) {
            correctUserAnswers++;
          }
        }
      });
      setCompleteTest(true);
      setCorrectUserAnswers(correctUserAnswers);
    }
  }, [nextHref, router, userSelectedAnswers, correctAnswers, modalTitle]);

  const handleAnswerSelect = useCallback((args: OnAnswerSelectArgs) => {
    setUserSelectedAnswers(prevSelectedAnswers => {
      if (args.type === 'number') {
        const updatedAnswer = {
          ...args.selectedAnswer,
          value: args.inputNumberValue,
        };

        return prevSelectedAnswers.some(
          answer => answer.id === updatedAnswer.id
        )
          ? prevSelectedAnswers.map(answer =>
              answer.id === updatedAnswer.id ? updatedAnswer : answer
            )
          : [...prevSelectedAnswers, updatedAnswer];
      } else if (args.type === 'multiple') {
        // For checkbox
        if (args.isChecked) {
          return [...prevSelectedAnswers, args.selectedAnswer];
        } else {
          return prevSelectedAnswers.filter(
            answer => answer.id !== args.selectedAnswer.id
          );
        }
      } else if (args.type === 'single') {
        // For radio
        return [
          ...prevSelectedAnswers.filter(
            answer => answer.questionId !== args.questionId
          ),
          { ...args.selectedAnswer, questionId: args.questionId },
        ];
      } else {
        // For other answers
        return prevSelectedAnswers.some(
          answer => answer.id === args.selectedAnswer.id
        )
          ? prevSelectedAnswers
          : [...prevSelectedAnswers, args.selectedAnswer];
      }
    });
  }, []);

  const handleLinkClick = useCallback(() => {
    if (!completeTest && pathRouteTakeTest) {
      setNextHref(`/${user}/take-tests`);
      openModal(
        'Are you sure you want to leave the page without complete the test?'
      );
    }
    if (completeTest && pathRouteTakeTest) {
      router.replace(`/${user}/take-tests`);
    }
  }, [completeTest, pathRouteTakeTest]);

  const onClickHandlerCompleteTest = useCallback(() => {
    openModal('Are you sure you want to complete the test?');
  }, [openModal]);

  useEffect(() => {
    if (selectedTestItem) {
      const correct = selectedTestItem.questions.flatMap(question =>
        question.answers.filter(answer => answer.is_right)
      );
      setCorrectAnswers(correct);
    }
  }, [selectedTestItem]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message = 'Are you sure you want to leave this page?';
      event.returnValue = message;
      return message;
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className={s.container}>
      <div className={s['test-title']}> {selectedTestItem?.title}</div>
      {!completeTest &&
        selectedTestItem &&
        selectedTestItem.questions.map(test => {
          return (
            <div key={test.id}>
              <h2 className={s.title}>{test.title}</h2>
              <QuestionsForTest
                question={test}
                takeTest={pathRouteTakeTest}
                onAnswerSelect={handleAnswerSelect}
              />
            </div>
          );
        })}
      {completeTest && (
        <>
          <div>Correct answers:</div>
          <div>
            {correctUserAnswers} from {correctAnswers?.length}
          </div>
        </>
      )}

      <div className={s['buttons-box']}>
        {!completeTest ? (
          <>
            {' '}
            <ChangeButton
              title={'Go Back'}
              onClick={handleLinkClick}
            />
            <ChangeButton
              title={'Complete'}
              onClick={onClickHandlerCompleteTest}
            />
          </>
        ) : (
          <>
            <ChangeButton
              title={'Go Back'}
              onClick={handleLinkClick}
            />
            <ChangeButton
              title={'Try again'}
              onClick={retryTest}
            />
          </>
        )}
      </div>

      <ModalWindow
        isModalWindowOpen={isModalOpen}
        title={modalTitle}
        onClose={closeModal}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default memo(TestPage);
