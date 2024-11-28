import React, {
  FC,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { v1 } from 'uuid';
import { Reorder } from 'motion/react';

import Input from '../Inputs/Input/Input';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import ChangeButton from '../Buttons/ChangeButton/ChangeButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';

import { AnswerItem, QuestionItem } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { removeQuestion, updateAnswersOrder } from '@/store/questionReduser';
import { addAnswer, removeAnswer } from '@/store/questionReduser';

import s from './QuestionBox.module.sass';
import cx from 'classnames';

type QuestionBoxItems = {
  question: QuestionItem;
  takeTest: boolean;
  changeTitleModalWindow: (editTitle: string, createTitle: string) => void;
  setModalWindowIsOpen: React.Dispatch<SetStateAction<boolean>>;
  modalFunctionOnClick: boolean;
};

const QuestionBox: FC<QuestionBoxItems> = ({
  question,
  takeTest,
  changeTitleModalWindow,
  setModalWindowIsOpen,
  modalFunctionOnClick,
}) => {
  const [answerOption, setAnswerOption] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const [questionState, setQuestionState] = useState(question.answer);

  const addAnswerAction = useActionWithPayload(addAnswer);
  const removeAnswerAction = useActionWithPayload(removeAnswer);
  const removeQuestionAction = useActionWithPayload(removeQuestion);
  const updateAnswersOrderAction = useActionWithPayload(updateAnswersOrder);

  const checkAnswerValue =
    inputValue.length >= 3 &&
    inputValue.trim() !== '' &&
    inputValue.length <= 19;

  const removeQuestionHandler = useCallback(
    (questionId: string) => {
      removeQuestionAction({ questionId });
    },
    [removeQuestionAction]
  );

  const removeAnswerHandler = useCallback(
    (questionId: string, answerId: string) => {
      removeAnswerAction({ questionId, answerId });
    },
    [removeAnswerAction]
  );

  const cleanInputs = useCallback(() => {
    setInputValue('');
    setIsChecked(false);
  }, []);

  const addAnswerHandler = useCallback(
    (questionId: string, answer: AnswerItem) => {
      if (checkAnswerValue) {
        addAnswerAction({ questionId, answer });
        cleanInputs();
        setError(false);
        // setQuestionState(prevState => [...prevState, answer]);
      } else {
        setError(true);
      }
    },
    [addAnswerAction, checkAnswerValue, cleanInputs]
  );
  const saveClickHandler = useCallback(() => {
    const newAnswer: AnswerItem = {
      id: v1(),
      title: inputValue,
      name: question.title,
      isTrue: question.questionType === 'number' ? true : isChecked,
    };
    addAnswerHandler(question.id, newAnswer);
  }, [addAnswerHandler, inputValue, isChecked]);

  const onClickDeleteQuestion = useCallback(() => {
    changeTitleModalWindow(
      'Are you sure you want to delete the question?',
      'Are you sure you want to delete the question?'
    );
    setModalWindowIsOpen(true);
    if (modalFunctionOnClick) {
      removeQuestionHandler(question.id);
    }
  }, [modalFunctionOnClick]);

  const addTrueAnswerChange =
    question.questionType === 'checkbox' ||
    (question.questionType === 'radio' && !question.answer.some(a => a.isTrue));

  const hasTrueAnswer = question.answer.some(answer => answer.isTrue);

  useEffect(() => {
    setQuestionState(question.answer);
  }, [question.answer]);

  const previousOrderRef = useRef<AnswerItem[]>(question.answer);

  const handleReorder = (newOrder: AnswerItem[]) => {
    if (JSON.stringify(previousOrderRef.current) !== JSON.stringify(newOrder)) {
      setQuestionState(newOrder);
      updateAnswersOrderAction({ questionId: question.id, newOrder });
      previousOrderRef.current = newOrder;
    }
  };

  return (
    <div className={s['questions-box']}>
      <span className={s['type-question']}>{question.questionType}</span>
      <div key={question.id}>
        <h3 className={s.title}>{question.title}</h3>
        <Reorder.Group
          values={questionState}
          onReorder={handleReorder}
          className={s['answer-list']}
        >
          {questionState.map(answer => (
            <Reorder.Item
              value={answer}
              key={answer.id}
              className={s['option']}
            >
              <span>{answer.title}</span>
              <DeleteButton
                onClick={() => removeAnswerHandler(question.id, answer.id)}
              />
              {answer.isTrue && <div className={s.true}>True</div>}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      {question && answerOption && (
        <div className={s['test-title']}>
          <Input
            title={
              question.questionType !== 'number'
                ? 'Answer the question:'
                : 'Correct answer'
            }
            type={question.questionType !== 'number' ? 'text' : 'number'}
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
                saveClickHandler();
                setAnswerOption(prevValue => !prevValue);
                setQuestionState(question.answer);
              }}
            />
          </div>
        </div>
      )}
      {!takeTest && (
        <div className={s.buttons}>
          <ChangeButton
            title={'Delete question'}
            onClick={onClickDeleteQuestion}
          />
          {!(
            question.questionType === 'number' && question.answer.length === 1
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
      {!hasTrueAnswer ? <span>There must be at list one true answer</span> : ''}
    </div>
  );
};

export default memo(QuestionBox);
