import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { v1 } from 'uuid';
import { Reorder } from 'motion/react';

import Input from '../Inputs/Input/Input';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';

import { AnswerItem, QuestionItem } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { updateAnswersOrder } from '@/store/questionReduser';
import { addAnswer, removeAnswer } from '@/store/questionReduser';
import { questionSelector } from '@/store/selectors';
import { AppDispatch } from '@/store';
import {
  createAnswerThunk,
  deleteAnswerThunk,
  moveAnswerThunk,
} from '@/thunk/testsThunk';

import s from './QuestionBox.module.sass';
import cx from 'classnames';

type QuestionBoxItems = {
  question: QuestionItem;
  takeTest: boolean;
  questionId: string;
  removeQuestionHandler: () => void;
  questions: QuestionItem[];
};

const QuestionBox: FC<QuestionBoxItems> = ({
  question,
  takeTest,
  questionId,
  removeQuestionHandler,
  questions,
}) => {
  const [answerOption, setAnswerOption] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerItem[]>(
    question.answers
  );
  const [questionTitleValue, setQuestionTitleValue] = useState(question.title);

  const dispatch = useDispatch<AppDispatch>();
  const addAnswerAction = useActionWithPayload(addAnswer);
  const removeAnswerAction = useActionWithPayload(removeAnswer);
  const updateAnswersOrderAction = useActionWithPayload(updateAnswersOrder);
  const router = useRouter();
  const pathRouteCreate = router.pathname === '/admin/createTests';
  const pathRouteEdit = router.pathname.startsWith('/admin/editTest');
  const allQuestions = useSelector(questionSelector);
  const checkAnswerValue =
    inputValue.length >= 1 &&
    inputValue.trim() !== '' &&
    inputValue.length <= 19;

  const cleanInputs = useCallback(() => {
    setInputValue('');
    setIsChecked(false);
  }, []);

  const saveClickHandler = useCallback(() => {
    const newAnswer: AnswerItem = {
      id: v1(),
      text: inputValue,
      name: question.title,
      is_right: question.question_type === 'number' ? true : isChecked,
      questionId,
    };
    if (checkAnswerValue) {
      addAnswerAction({ questionId, newAnswer });
      const newAnswerData = {
        questionId,
        data: {
          text: inputValue,
          is_right: question.question_type === 'number' ? true : isChecked,
        },
      };

      if (pathRouteEdit) {
        dispatch(createAnswerThunk(newAnswerData)).then(response => {
          const newAnswer: AnswerItem = {
            id: response.payload.id,
            text: inputValue,
            name: question.title,
            is_right: response.payload.is_right,
            questionId,
          };
          setAnswerState(prevState => [newAnswer, ...prevState]);
          cleanInputs();
          setError(false);
        });
      } else {
        const newAnswer: AnswerItem = {
          id: v1(),
          text: inputValue,
          name: question.title,
          is_right: question.question_type === 'number' ? true : isChecked,
          questionId,
        };

        setAnswerState(prevState => [newAnswer, ...prevState]);
        cleanInputs();
        setError(false);
      }
    } else {
      setError(true);
    }
  }, [
    checkAnswerValue,
    inputValue,
    isChecked,
    question.title,
    questionId,
    question.question_type,
    pathRouteEdit,
    dispatch,
    cleanInputs,
  ]);

  const removeAnswerHandler = useCallback(
    (questionId: string, answerId: string) => {
      if (pathRouteCreate) {
        removeAnswerAction({ questionId, answerId });
      } else {
        removeAnswerAction({ questionId, answerId });
        dispatch(deleteAnswerThunk(answerId)).then(() => {
          setAnswerState(prevState =>
            prevState.filter(answer => answer.id !== answerId)
          );
        });
      }
    },
    [removeAnswerAction, dispatch, questionId, pathRouteCreate]
  );

  const hasTrueAnswer =
    answerState.some(answer => answer.is_right) && answerState.length >= 2;

  const hasAnswerTest = answerState.length >= 1;

  const isQuestionListValid = allQuestions.length >= 2 || questions.length >= 2;

  const previousOrderRef = useRef<AnswerItem[]>(question.answers);

  const handleReorder = (newOrder: AnswerItem[]) => {
    if (JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)) {
      setAnswerState(newOrder);
      updateAnswersOrderAction({ questionId: question.id, newOrder });
      newOrder.forEach((answer, index) => {
        dispatch(moveAnswerThunk({ id: answer.id, position: index }));
      });
      previousOrderRef.current = newOrder;
    }
  };

  useEffect(() => {
    setAnswerState(question.answers);
    if (checkAnswerValue) {
      setError(false);
    }
  }, [question.answers]);

  const addTrueAnswerChange =
    question.question_type === 'multiple' ||
    (question.question_type === 'single' && !answerState.some(a => a.is_right));
  return (
    <div className={s['questions-box']}>
      <span className={s['type-question']}>{question.question_type}</span>
      <div key={question.id}>
        <h3 className={s.title}>{questionTitleValue}</h3>
        <Reorder.Group
          values={answerState}
          onReorder={handleReorder}
          className={s['answer-list']}
        >
          {answerState.map(answer => (
            <Reorder.Item
              value={answer}
              key={answer.id}
              className={s['option']}
            >
              <span>{answer.text}</span>
              <DeleteButton
                onClick={() => removeAnswerHandler(question.id, answer.id)}
              />
              {answer.is_right && <div className={s.true}>True</div>}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      {question && answerOption && (
        <div className={s['test-title']}>
          <Input
            title={
              question.question_type !== 'number'
                ? 'Answer the question:'
                : 'Correct answer'
            }
            type={question.question_type !== 'number' ? 'text' : 'number'}
            name={'question'}
            leftCheck={true}
            setInputValue={setInputValue}
            value={inputValue}
            error={error}
          />
          {addTrueAnswerChange && (
            <Checkbox
              title={'Select true answer'}
              type={'checkbox'}
              name={'selectTrue'}
              leftCheck={false}
              setIsChecked={setIsChecked}
              isChecked={isChecked}
              id={question.id}
            />
          )}

          <div className={s.buttons}>
            <ChangeButton
              title="Add answer"
              onClick={() => {
                if (!error) {
                  setAnswerOption(prevValue => !prevValue);
                  saveClickHandler();
                }
              }}
            />
          </div>
        </div>
      )}
      {!takeTest && (
        <div className={s.buttons}>
          <ChangeButton
            title={'Delete question'}
            onClick={removeQuestionHandler}
          />
          {!(
            question.question_type === 'number' && question.answers.length === 1
          ) && (
            <ChangeButton
              title={answerOption ? 'Hide' : 'Add answer'}
              onClick={() => {
                setAnswerOption(prevValue => !prevValue);
              }}
            />
          )}
        </div>
      )}
      {!hasTrueAnswer ? (
        <span className={s['error-answer']}>
          The list must contain at least two answers one of them is true
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default memo(QuestionBox);
