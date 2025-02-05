import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Reorder } from 'motion/react';
import { useDispatch } from 'react-redux';

import { v1 } from 'uuid';

import AnswerBox from '../AnswerBox/AnswerBox';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';
import Input from '../Inputs/Input/Input';

import { useActionWithPayload } from '@/hooks/useAction';
import { AppDispatch } from '@/store';
import { updateAnswersOrder } from '@/store/questionReducer';
import { addAnswer, removeAnswer } from '@/store/questionReducer';
import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';
import {
  createAnswerThunk,
  deleteAnswerThunk,
  editQuestionThunk,
  moveAnswerThunk,
} from '@/thunk/testsThunk';

import s from './QuestionBox.module.sass';
import cx from 'classnames';

type QuestionBoxProps = {
  question: QuestionItem;
  takeTest: boolean;
  questionId: string;
  removeQuestionHandler: (questionId: string) => void;
  onAnswerSelect?: (args: OnAnswerSelectArgs) => void;
  pathRouteEdit: boolean;
  pathRouteCreate: boolean;
};

const QuestionBox: FC<QuestionBoxProps> = ({
  question,
  takeTest,
  questionId,
  removeQuestionHandler,
  onAnswerSelect,
  pathRouteEdit,
  pathRouteCreate,
}) => {
  const [answerOption, setAnswerOption] = useState(false);
  const [inputValue, setInputValue] = useState<string | undefined>('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerItem[]>(
    question.answers
  );
  const [questionTitleValue, setQuestionTitleValue] = useState(question.title);
  const [oldQuestionTitle, setOldQuestionTitle] = useState<string | undefined>(
    ''
  );
  const previousOrderRef = useRef<AnswerItem[]>(question.answers);

  const dispatch = useDispatch<AppDispatch>();
  const addAnswerAction = useActionWithPayload(addAnswer);
  const removeAnswerAction = useActionWithPayload(removeAnswer);
  const updateAnswersOrderAction = useActionWithPayload(updateAnswersOrder);

  const checkAnswerValue =
    inputValue &&
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
      text: String(inputValue),
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
    inputValue,
    question.title,
    question.question_type,
    isChecked,
    questionId,
    checkAnswerValue,
    addAnswerAction,
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
    [removeAnswerAction, dispatch, pathRouteCreate]
  );

  const handleReorder = useCallback(
    (newOrder: AnswerItem[]) => {
      if (
        JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)
      ) {
        setAnswerState(newOrder);
        updateAnswersOrderAction({ questionId: question.id, newOrder });
        if (!takeTest) {
          newOrder.forEach((answer, index) => {
            dispatch(moveAnswerThunk({ id: answer.id, position: index }));
          });
        }
        previousOrderRef.current = newOrder;
      }
    },
    [dispatch, question.id, takeTest, updateAnswersOrderAction]
  );

  // const changeTitleHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setQuestionTitleValue(e.currentTarget.value);
  // }, []);

  const handlerAddAnswer = useCallback(() => {
    setAnswerOption(!answerOption);
  }, [answerOption]);

  const cancelChangeTaskTitle = useCallback(() => {
    setIsHidden(!isHidden);
    setQuestionTitleValue(oldQuestionTitle);
  }, [isHidden, oldQuestionTitle]);

  // const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(e.currentTarget.value);
  // }, []);

  const removeQuestionHand = useCallback(() => {
    removeQuestionHandler(questionId);
  }, [questionId, removeQuestionHandler]);

  const changeQuestionTitleHandler = useCallback(() => {
    setIsHidden(!isHidden);
    if (isHidden) {
      if (questionTitleValue && questionTitleValue.trim() === '') {
        setQuestionTitleValue(questionTitleValue.trim());
      }
      if (pathRouteEdit) {
        dispatch(
          editQuestionThunk({
            id: question.id,
            data: {
              title: String(questionTitleValue),
              question_type: question.question_type,
              answer: 0,
            },
          })
        );
      }
    }
    setOldQuestionTitle(questionTitleValue);
  }, [
    dispatch,
    isHidden,
    pathRouteEdit,
    question.id,
    question.question_type,
    questionTitleValue,
  ]);

  const addAnswerClick = useCallback(() => {
    if (!error) {
      handlerAddAnswer();
      saveClickHandler();
    }
  }, [error, handlerAddAnswer, saveClickHandler]);

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
              title: String(questionTitleValue),
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
  }, [checkAnswerValue, question.answers]);

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
            autoFocus={true}
            isHidden={isHidden}
            leftCheck={false}
            name={''}
            title={''}
            type={'text'}
            value={questionTitleValue}
            onBlur={changeQuestionTitleHandler}
            onChange={setQuestionTitleValue}
            onKeyDown={keyDownHandler}
          />
        ))}
      <Reorder.Group
        className={cx(s['answer-list'], { [s['margin-top']]: isHidden })}
        values={answerState}
        onReorder={takeTest ? () => {} : handleReorder}
      >
        {answerState.map(answer => {
          return (
            <Reorder.Item
              key={answer.id}
              className={s['option']}
              value={answer}
            >
              <AnswerBox
                key={answer.id}
                answer={answer}
                pathRouteEdit={pathRouteEdit}
                question={question}
                removeAnswerHandler={removeAnswerHandler}
                takeTest={takeTest}
                onAnswerSelect={onAnswerSelect}
              />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      {question && answerOption && (
        <div className={s['test-title']}>
          <Input
            error={error}
            leftCheck={true}
            name={'question'}
            title={
              question.question_type !== 'number'
                ? 'Answer the question:'
                : 'Correct answer'
            }
            type={question.question_type !== 'number' ? 'text' : 'number'}
            value={inputValue}
            onChange={setInputValue}
          />
          {addTrueAnswerChange && (
            <Checkbox
              id={question.id}
              leftCheck={false}
              name={'selectTrue'}
              questionId={questionId}
              setIsChecked={setIsChecked}
              title={'Select true answer'}
              type={'checkbox'}
            />
          )}

          <div className={s.buttons}>
            <ChangeButton
              title="Add answer"
              onClick={addAnswerClick}
            />
          </div>
        </div>
      )}
      {!takeTest && (
        <div className={s.buttons}>
          <ChangeButton
            title={'Delete question'}
            onClick={removeQuestionHand}
          />
          {!(
            question.question_type === 'number' && question.answers.length === 1
          ) && (
            <ChangeButton
              title={answerOption ? 'Hide' : 'Add answer'}
              onClick={handlerAddAnswer}
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
