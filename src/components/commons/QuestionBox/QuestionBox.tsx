import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v1 } from 'uuid';
import { Reorder } from 'motion/react';

import Input from '../Inputs/Input/Input';

import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';

import { AnswerItem, QuestionItem } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { updateAnswersOrder } from '@/store/questionReduser';
import { addAnswer, removeAnswer } from '@/store/questionReduser';

import s from './QuestionBox.module.sass';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createAnswerThunk, deleteAnswerThunk } from '@/thunk/testsThunk';
import { useRouter } from 'next/router';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import ModalWindow from '../ModalWindow/ModalWindow';

type QuestionBoxItems = {
  question: QuestionItem;
  takeTest: boolean;
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  questionId: string;
  removeQuestionHandler: () => void;
  // saveAnswerClickHandler: (
  //   questionId: string,
  //   inputValue: string,
  //   isChecked: boolean,
  //   checkAnswerValue: boolean,
  //   question: QuestionItem,
  //   answerState: AnswerItem[]
  // ) => void;
  isModalWindowTitle: string;
};

const QuestionBox: FC<QuestionBoxItems> = ({
  question,
  takeTest,
  questionId,
  setQuestions,
  removeQuestionHandler,
  // saveAnswerClickHandler,
  isModalWindowTitle,
}) => {
  const [answerOption, setAnswerOption] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [answerState, setAnswerState] = useState<AnswerItem[]>(question.answer);
  const [questionTitleValue, setQuestionTitleValue] = useState(question.title);

  const dispatch = useDispatch<AppDispatch>();
  const addAnswerAction = useActionWithPayload(addAnswer);
  const removeAnswerAction = useActionWithPayload(removeAnswer);
  const updateAnswersOrderAction = useActionWithPayload(updateAnswersOrder);
  const router = useRouter();
  const pathRouteCreate = router.pathname === '/admin/createTests';
  // const pathRouteEdit = router.pathname === `/admin/editTest/${question.id}`;

  const checkAnswerValue =
    inputValue.length >= 1 &&
    inputValue.trim() !== '' &&
    inputValue.length <= 19;

  const saveClickHandlerDOM = useCallback(() => {
    const newAnswer: AnswerItem = {
      id: v1(),
      title: inputValue,
      name: question.title,
      is_right: question.question_type === 'number' ? true : isChecked,
    };
    if (checkAnswerValue) {
      addAnswerAction({ questionId, newAnswer });
      cleanInputs();
      setError(false);
    } else {
      setError(true);
    }
  }, [addAnswerAction, inputValue, isChecked]);

  const removeAnswerHandler = useCallback(
    (questionId: string, answerId: string) => {
      if (pathRouteCreate) {
        removeAnswerAction({ questionId, answerId });
      } else {
        dispatch(deleteAnswerThunk(answerId));
      }
    },
    [removeAnswerAction, dispatch]
  );
  const cleanInputs = useCallback(() => {
    setInputValue('');
    setIsChecked(false);
  }, []);

  const saveClickHandler = useCallback(async () => {
    if (checkAnswerValue) {
      const data = {
        text: inputValue,
        is_right: question.question_type === 'number' ? true : isChecked,
      };
      const answerResponse = await dispatch(
        createAnswerThunk({ questionId, data })
      ).unwrap();
      const newAnswers = answerState.map(el => ({
        questionId: answerResponse.id,
        data: {
          text: el.title,
          is_right: el.is_right,
        },
      }));
      for (const newAnswer of newAnswers) {
        await dispatch(createAnswerThunk(newAnswer));
      }
      cleanInputs();
      setError(false);

      setError(true);
    } else {
      setError(true);
    }
  }, [
    dispatch,
    questionId,
    inputValue,
    isChecked,
    checkAnswerValue,
    answerState,
    cleanInputs,
  ]);
  
  const previousOrderRef = useRef<AnswerItem[]>(question.answer);

  const handleReorder = (newOrder: AnswerItem[]) => {
    if (JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)) {
      setAnswerState(newOrder);
      updateAnswersOrderAction({ questionId: question.id, newOrder });
      previousOrderRef.current = newOrder;
    }
  };
  const onConfirm = useCallback(() => {
    if (isModalWindowTitle.includes('save') && pathRouteCreate) {
      saveClickHandler();
      cleanInputs();
    }
    // else if (isModalWindowTitle.includes('save') && pathRouteEdit) {
    //   saveChange();
    // }
  }, []);

  useEffect(() => {
    setAnswerState(question.answer);
    if (checkAnswerValue) {
      setError(false);
    }
  }, [question.answer, checkAnswerValue]);
  console.log(question);

  const addTrueAnswerChange =
    question.question_type === 'multiple' ||
    (question.question_type === 'single' &&
      !question.answer.some(a => a.is_right));

  const hasTrueAnswer =
    question.answer.some(answer => answer.is_right) &&
    question.answer.length >= 2;

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
              <span>{answer.title}</span>
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
                  // saveClickHandler();
                  setAnswerOption(prevValue => !prevValue);
                  saveClickHandlerDOM();
                  // setAnswerState(question.answer);
                  // removeAllQuestionAction();
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
            question.question_type === 'number' && question.answer.length === 1
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
