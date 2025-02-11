import React, { FC, memo, useCallback, useState } from 'react';

import Image from 'next/image';
import { useDispatch } from 'react-redux';

import dotsIcon from '/public/img/dots.svg?url';

import DeleteButton from '../Buttons/DeleteButton/DeleteButton';
import Checkbox from '../Inputs/Checkbox/Checkbox';
import Input from '../Inputs/Input/Input';

import { AppDispatch } from '@/store';
import { AnswerItem, OnAnswerSelectArgs, QuestionItem } from '@/store/types';
import { editAnswerThunk } from '@/thunk/testsThunk';

import s from './AnswerBox.module.sass';

type AnswerBoxProps = {
  question: QuestionItem;
  takeTest: boolean;
  onAnswerSelect?: (args: OnAnswerSelectArgs) => void;
  answer: AnswerItem;
  removeAnswerHandler?: (questionId: string, answerId: string) => void;
  pathRouteEdit: boolean;
};

const AnswerBox: FC<AnswerBoxProps> = ({
  question,
  takeTest,
  onAnswerSelect,
  answer,
  removeAnswerHandler,
  pathRouteEdit,
}) => {
  const [answerTitleValue, setAnswerTitleValue] = useState<string | undefined>(
    answer.text
  );
  const [oldAnswerTitle, setOldAnswerTitle] = useState('');
  const [isHiddenInputAnswer, setIsHiddenInputAnswer] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const cancelChangeAnswerTitle = useCallback(() => {
    setIsHiddenInputAnswer(prev => !prev);
    setAnswerTitleValue(oldAnswerTitle);
  }, [oldAnswerTitle]);

  const deleteButtonHandler = useCallback(() => {
    removeAnswerHandler?.(question.id, answer.id);
  }, [answer.id, question.id, removeAnswerHandler]);

  const dispatchEditAnswerThunk = useCallback(() => {
    return dispatch(
      editAnswerThunk({
        id: answer.id,
        data: { text: String(answerTitleValue), is_right: answer.is_right },
      })
    );
  }, [answer.id, answer.is_right, answerTitleValue]);

  const changeAnswerTitleHandler = useCallback(() => {
    setIsHiddenInputAnswer(prev => !prev);
    if (answerTitleValue) {
      if (!isHiddenInputAnswer) {
        setOldAnswerTitle(answerTitleValue);
        return;
      }
      if (answerTitleValue.trim() === '') {
        setAnswerTitleValue(answerTitleValue.trim());
      }
      if (pathRouteEdit) {
        dispatchEditAnswerThunk();
      }
    }
  }, [answerTitleValue, isHiddenInputAnswer, pathRouteEdit]);

  const keyDownAnswerHandler = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') cancelChangeAnswerTitle();
      if (event.key === 'Enter') changeAnswerTitleHandler();
    },
    [cancelChangeAnswerTitle, changeAnswerTitleHandler]
  );

  return (
    <>
      {takeTest && (
        <Checkbox
          answer={answer}
          id={answer.id}
          leftCheck={false}
          name={question.id}
          questionId={question.id}
          setIsChecked={() => {}}
          title={answer.text}
          type={question.question_type}
          onAnswerSelect={onAnswerSelect}
        />
      )}
      {!takeTest &&
        (!isHiddenInputAnswer ? (
          <span onDoubleClick={changeAnswerTitleHandler}>
            {answerTitleValue}
          </span>
        ) : (
          <Input
            autoFocus={true}
            leftCheck={false}
            name={''}
            title={''}
            type={'text'}
            value={answerTitleValue}
            onBlur={changeAnswerTitleHandler}
            onChange={setAnswerTitleValue}
            onKeyDown={keyDownAnswerHandler}
          />
        ))}
      {!takeTest && <DeleteButton onClick={deleteButtonHandler} />}
      {!takeTest && answer.is_right && <div className={s.true}>True</div>}
      {!takeTest && (
        <div className={s.grab}>
          <Image
            alt={'dots'}
            className={s['dots-icon']}
            src={dotsIcon}
          />
        </div>
      )}
    </>
  );
};

export default memo(AnswerBox);
