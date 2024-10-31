import React, {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/router';

import { testsOptions } from '@/components/state/testsOptions';

import SelectField from '@/components/commons/SelectField/SelectField';
import Input from '@/components/commons/Inputs/Input/Input';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import s from './CreateTests.module.sass';
import cx from 'classnames';
import { QuestionItem, TestsOptionsForSelect } from '@/store/types';
import { v1 } from 'uuid';

type CreateTestsItems = {
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: Dispatch<SetStateAction<string>>;
};

const CreateTests: FC<CreateTestsItems> = ({
  setModalWindowIsOpen,
  setTitleModalWindow,
}) => {
  const [select, setSelect] = useState('Select question type');
  const [selectType, setSelectType] = useState('none');
  const [resultQuestions, setResultQuestions] = useState<QuestionItem[]>([])
  const [question, setQuestion] = useState<QuestionItem>({
    id: '',
    title: '',
    questionType: 'none' as TestsOptionsForSelect,
    answer: [],
  });
  const [inputValue, setInputValue] = useState('');

  const addQuestion = () => {
    setQuestion({
      id: v1(),
      title: inputValue,
      questionType: selectType as TestsOptionsForSelect,
      answer: [],
    });
  };

  const router = useRouter();
  const changeTitleModalWindow = (editTitle: string, createTitle: string) => {
    if (pathRouteEdit) {
      setTitleModalWindow(editTitle);
    } else if (pathRouteCreate) {
      setTitleModalWindow(createTitle);
    }
  };
  useEffect(() => {
    console.log(question);
  }, [question]);

  const pathRouteEdit = router.pathname === '/admin/editTest';
  const pathRouteCreate = router.pathname === '/admin/createTests';

  return (
    <div className={s.container}>
      <h2 className={s.title}>{pathRouteEdit ? 'Edit Test' : 'Create Test'}</h2>
      <div className={s.form}>
        <div className={s['test-title']}>
          <Input
            title={'Test Title:'}
            type={'text'}
            name={'name'}
            leftCheck={true}
            setInputValue={() => {}}
          />
        </div>

        <div className={s['test-title']}>
          <Input
            title={'Question Title:'}
            type={'text'}
            name={'questionTitle'}
            leftCheck={true}
            setInputValue={setInputValue}
          />
          <SelectField
            defaultValue={select}
            directionOptions={testsOptions}
            setSelect={setSelect}
            onChange={setSelectType}
          />
          <ChangeButton
            title={'Add question'}
            onClick={() => {
              console.log(question);//console log
              addQuestion();
            }}
          />
        </div>
        {/* {question.map(q => (
          <QuestionBox
            key={q.id}
            question={question}
            takeTest={false}
          />
        ))} */}
        {pathRouteEdit && (
          <QuestionBox
            question={[]}
            takeTest={false}
          />
        )}

        <div className={s.buttons}>
          <ChangeButton
            title="Delete Test"
            onClick={() => {
              setModalWindowIsOpen();
              changeTitleModalWindow(
                'Are you sure you want to cancel the changes?',
                'Are you sure you want to delete the test?'
              );
            }}
          />
          {pathRouteEdit && (
            <ChangeButton
              title="Cancel Changes"
              onClick={() => {
                setModalWindowIsOpen();
                changeTitleModalWindow(
                  'Are you sure you want to cancel the changes?',
                  ''
                );
              }}
            />
          )}

          <ChangeButton
            title="Save Test"
            onClick={() => {
              setModalWindowIsOpen();
              changeTitleModalWindow(
                'Are you sure you want to save the changes?',
                'Are you sure you want to save the test?'
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CreateTests);
