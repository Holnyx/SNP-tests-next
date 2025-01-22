import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Reorder } from 'motion/react';
import { v1 } from 'uuid';

import Input from '../Inputs/Input/Input';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';
import AnswerBox from '../AnswerBox/AnswerBox';

import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { updateAnswersOrder } from '@/store/questionReducer';
import { addAnswer, removeAnswer } from '@/store/questionReducer';
import { AppDispatch } from '@/store';
import {
  createAnswerThunk,
  deleteAnswerThunk,
  editQuestionThunk,
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
  onAnswerSelect: (args: OnAnswerSelectArgs) => void;
};

const QuestionBox: FC<QuestionBoxItems> = ({
  question,
  takeTest,
  questionId,
  removeQuestionHandler,
  questions,
  onAnswerSelect,
}) => {
  const [answerOption, setAnswerOption] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerItem[]>(
    question.answers
  );
  const [questionTitleValue, setQuestionTitleValue] = useState(question.title);
  const [oldQuestionTitle, setOldQuestionTitle] = useState('');

  const previousOrderRef = useRef<AnswerItem[]>(question.answers);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const addAnswerAction = useActionWithPayload(addAnswer);
  const removeAnswerAction = useActionWithPayload(removeAnswer);
  const updateAnswersOrderAction = useActionWithPayload(updateAnswersOrder);

  const pathRouteCreate = router.pathname === '/admin/create-tests';
  const pathRouteEdit = router.pathname.startsWith('/admin/edit-test');

  const checkAnswerValue =
    inputValue.length >= 1 &&
    inputValue.trim() !== '' &&
    inputValue.length <= 30;

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

  const handleReorder = (newOrder: AnswerItem[]) => {
    if (JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)) {
      setAnswerState(newOrder);
      updateAnswersOrderAction({ questionId: question.id, newOrder });
      if (!takeTest) {
        newOrder.forEach((answer, index) => {
          dispatch(moveAnswerThunk({ id: answer.id, position: index }));
        });
      }
      previousOrderRef.current = newOrder;
    }
  };

  const changeTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuestionTitleValue(e.currentTarget.value);
    },
    [setQuestionTitleValue]
  );

  const cancelChangeTaskTitle = () => {
    setIsHidden(!isHidden);
    setQuestionTitleValue(oldQuestionTitle);
  };

  const changeQuestionTitleHandler = () => {
    setIsHidden(!isHidden);
    if (isHidden) {
      questionTitleValue.trim() === '' &&
        setQuestionTitleValue(questionTitleValue.trim());
    }
    setOldQuestionTitle(questionTitleValue);
  };

  const keyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelChangeTaskTitle();
    } else if (event.key === 'Enter') {
      changeQuestionTitleHandler();
      if (pathRouteEdit) {
        dispatch(
          editQuestionThunk({
            id: question.id,
            data: {
              title: questionTitleValue,
              question_type: question.question_type,
              answer: 0,
            },
          })
        );
      }
    }
  };

  useEffect(() => {
    setAnswerState(question.answers);
    if (checkAnswerValue) {
      setError(false);
    }
  }, [question.answers]);

  const hasTrueAnswer =
    answerState.some(answer => answer.is_right) && answerState.length >= 2;

  const addTrueAnswerChange =
    question.question_type === 'multiple' ||
    (question.question_type === 'single' && !answerState.some(a => a.is_right));

  return (
    <div className={s['questions-box']}>
      {!takeTest && (
        <span className={cx(s['type-question'], { [s['hide']]: isHidden })}>
          {question.question_type}
        </span>
      )}
      {!takeTest &&
        (!isHidden ? (
          <h3
            className={s.title}
            onDoubleClick={changeQuestionTitleHandler}
          >
            {questionTitleValue}
          </h3>
        ) : (
          <Input
            title={''}
            type={'text'}
            name={''}
            leftCheck={false}
            value={questionTitleValue}
            setInputValue={setQuestionTitleValue}
            onKeyDown={keyDownHandler}
            onChange={changeTitleHandler}
            onBlur={changeQuestionTitleHandler}
            autoFocus={true}
            isHidden={isHidden}
          />
        ))}
      <Reorder.Group
        values={answerState}
        onReorder={takeTest ? () => {} : handleReorder}
        className={cx(s['answer-list'], { [s['margin-top']]: isHidden })}
      >
        {answerState.map(answer => {
          return (
            <AnswerBox
              key={answer.id}
              question={question}
              takeTest={takeTest}
              onAnswerSelect={onAnswerSelect}
              answer={answer}
              removeAnswerHandler={removeAnswerHandler}
            />
          );
        })}
      </Reorder.Group>
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
              id={question.id}
              onAnswerSelect={() => {}}
              questionId={questionId}
              setIsChecked={setIsChecked}
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
      {!hasTrueAnswer && question.question_type !== 'number' ? (
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
