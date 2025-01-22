import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import { Reorder } from 'motion/react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import Input from '../Inputs/Input/Input';
import Checkbox from '../Inputs/Checkbox/Checkbox';
import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import dotsIcon from '/public/img/dots.svg?url';

import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';
import { AppDispatch } from '@/store';
import { editAnswerThunk } from '@/thunk/testsThunk';

import s from './AnswerBox.module.sass';
import cx from 'classnames';

type AnswerBoxItems = {
  question: QuestionItem;
  takeTest: boolean;
  onAnswerSelect: (args: OnAnswerSelectArgs) => void;
  answer: AnswerItem;
  removeAnswerHandler?: (questionId: string, answerId: string) => void;
};

const AnswerBox: FC<AnswerBoxItems> = ({
  question,
  takeTest,
  onAnswerSelect,
  answer,
  removeAnswerHandler,
}) => {
  const [answerTitleValue, setAnswerTitleValue] = useState(answer.text);
  const [oldAnswerTitle, setOldAnswerTitle] = useState('');
  const [isHiddenInputAnswer, setIsHiddenInputAnswer] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pathRouteEdit = router.pathname.startsWith('/admin/edit-test');

  const cancelChangeAnswerTitle = () => {
    setIsHiddenInputAnswer(!isHiddenInputAnswer);
    setAnswerTitleValue(oldAnswerTitle);
  };

  const changeAnswerTitleHandler = () => {
    setIsHiddenInputAnswer(!isHiddenInputAnswer);
    if (isHiddenInputAnswer) {
      answerTitleValue.trim() === '' &&
        setAnswerTitleValue(answerTitleValue.trim());
    }
    setOldAnswerTitle(answerTitleValue);
  };

  const keyDownAnswerHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelChangeAnswerTitle();
    } else if (event.key === 'Enter') {
      changeAnswerTitleHandler();
      if (pathRouteEdit) {
        dispatch(
          editAnswerThunk({
            id: answer.id,
            data: { text: answerTitleValue, is_right: answer.is_right },
          })
        );
      }
    }
  };

  const changeAnswerTitleEvent = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setAnswerTitleValue(e.currentTarget.value);
    },
    [setAnswerTitleValue]
  );

  return (
    <Reorder.Item
      value={answer}
      key={answer.id}
      className={s['option']}
    >
      {takeTest && (
        <Checkbox
          title={answer.text}
          type={question.question_type}
          name={question.id}
          leftCheck={false}
          id={answer.id}
          questionId={question.id}
          onAnswerSelect={onAnswerSelect}
          answer={answer}
          setIsChecked={() => {}}
        />
      )}
      {!takeTest &&
        (!isHiddenInputAnswer ? (
          <span onDoubleClick={changeAnswerTitleHandler}>
            {answerTitleValue}
          </span>
        ) : (
          <Input
            title={''}
            type={'text'}
            name={''}
            leftCheck={false}
            value={answerTitleValue}
            setInputValue={setAnswerTitleValue}
            onKeyDown={keyDownAnswerHandler}
            onChange={changeAnswerTitleEvent}
            onBlur={changeAnswerTitleHandler}
            autoFocus={true}
          />
        ))}
      {!takeTest && (
        <DeleteButton
          onClick={() =>
            removeAnswerHandler && removeAnswerHandler(question.id, answer.id)
          }
        />
      )}
      {!takeTest && answer.is_right && <div className={s.true}>True</div>}
      {!takeTest && (
        <Image
          className={s['dots-icon']}
          alt={'dots'}
          src={dotsIcon}
        />
      )}
    </Reorder.Item>
  );
};

export default memo(AnswerBox);
