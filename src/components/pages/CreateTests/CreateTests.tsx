import React, {
  FC,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { v1 } from 'uuid';
import { useRouter } from 'next/router';

import { testsOptions } from '@/components/state/testsOptions';
import SelectField from '@/components/commons/SelectField/SelectField';
import Input from '@/components/commons/Inputs/Input/Input';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import { QuestionItem, TestsItem, TestsOptionsForSelect } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { addQuestion, removeAllQuestion } from '@/store/questionReduser';
import { addTest, removeTest } from '@/store/testReduser';
import { questionSelector } from '@/store/selectors';

import s from './CreateTests.module.sass';
import cx from 'classnames';

type CreateTestsItems = {
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: React.Dispatch<SetStateAction<string>>;
  modalFunctionOnClick: boolean;
  id?: string;
  selectedTestItem: TestsItem;
  titleModalWindow: string;
};

const CreateTests: FC<CreateTestsItems> = ({
  setModalWindowIsOpen,
  setTitleModalWindow,
  modalFunctionOnClick,
  id,
  selectedTestItem,
  titleModalWindow,
}) => {
  const [select, setSelect] = useState('Select question type');
  const [selectType, setSelectType] = useState('none');
  const [testTitleValue, setTestTitleValue] = useState(selectedTestItem.title);
  const [inputValue, setInputValue] = useState('');
  const [errorTestTitle, setErrorTestTitle] = useState(false);
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState(false);

  const router = useRouter();
  const addTestAction = useActionWithPayload(addTest);
  const removeAllQuestionAction = useActionWithPayload(removeAllQuestion);
  const addQuestionAction = useActionWithPayload(addQuestion);
  const removeTestAction = useActionWithPayload(removeTest);
  const allQuestions = useSelector(questionSelector);

  const checkQuestionValue =
    inputValue.length >= 3 && inputValue.trim() !== '' && selectType !== 'none';

  const checkTestTitleValue =
    testTitleValue.length >= 3 && testTitleValue.trim() !== '';

  const hasAnswer = allQuestions.every(
    question =>
      question.answer.length >= 2 &&
      question.answer.some(answer => answer.isTrue)
  );
  const isQuestionListValid =
    allQuestions.length >= 2 || selectedTestItem.questions.length >= 2;

  const pathRouteEdit = router.asPath.startsWith(`/admin/editTest/${id}`);
  const pathRouteCreate = router.pathname === '/admin/createTests';

  const cleanInputs = useCallback(() => {
    setInputValue('');
    setSelectType('none');
    setSelect('Select question type');
  }, []);

  const onClickHandlerDeleteTest = useCallback(() => {
    setTitleModalWindow('Are you sure you want to delete the test?');
    setModalWindowIsOpen();
    // if (
    //   modalFunctionOnClick &&
    //   titleModalWindow === 'Are you sure you want to delete the test?'
    // ) {
    //   removeTestAction(selectedTestItem.id);
    // }
  }, [setTitleModalWindow, setModalWindowIsOpen]);

  const addQuestionHandler = useCallback(
    (question: QuestionItem) => {
      if (checkQuestionValue) {
        addQuestionAction(question);
        cleanInputs();
        setError(false);
      } else {
        setError(true);
      }
    },
    [addQuestionAction, checkQuestionValue, cleanInputs]
  );

  const saveQuestionClickHandler = useCallback(() => {
    const newQuestion: QuestionItem = {
      id: v1(),
      title: inputValue,
      questionType: selectType as TestsOptionsForSelect,
      answer: [],
    };
    addQuestionHandler(newQuestion);
  }, [addQuestionHandler, inputValue, selectType]);

  const saveTestClickHandler = useCallback(() => {
    const newTest: TestsItem = {
      id: v1(),
      title: testTitleValue,
      date: new Date().toISOString(),
      questions: allQuestions,
    };
    console.log(newTest);

    if (checkTestTitleValue) {
      addTestAction(newTest);
      cleanInputs();
      setError(false);
    } else {
      setError(true);
    }
  }, [checkTestTitleValue, cleanInputs, testTitleValue, allQuestions]);

  const changeTitleModalWindow = (editTitle: string, createTitle: string) => {
    if (pathRouteEdit) {
      setTitleModalWindow(editTitle);
    } else if (pathRouteCreate) {
      setTitleModalWindow(createTitle);
    }
  };

  const onClickHandlerSaveTest = useCallback(() => {
    if (!checkTestTitleValue) {
      setErrorTestTitle(true);
    } else {
      setErrorTestTitle(false);
    }
    if (!isQuestionListValid) {
      setErrorList(true);
    } else {
      setErrorList(false);
    }
    if (checkTestTitleValue && isQuestionListValid && hasAnswer) {
      changeTitleModalWindow(
        'Are you sure you want to save the changes?',
        'Are you sure you want to save the test?'
      );
      setModalWindowIsOpen();
    }
  }, [
    checkTestTitleValue,
    isQuestionListValid,
    hasAnswer,
    changeTitleModalWindow,
    setModalWindowIsOpen,
  ]);

  useEffect(() => {
    if (allQuestions.length >= 2) {
      setErrorList(false);
    }
  }, [allQuestions.length]);

  useEffect(() => {
    if (
      modalFunctionOnClick &&
      titleModalWindow === 'Are you sure you want to save the test?'
    ) {
      saveTestClickHandler();
      cleanInputs();
      setTestTitleValue('');
      setErrorTestTitle(false);
      removeAllQuestionAction();
      router.push('/admin/takeTests');
    }
    if (
      modalFunctionOnClick &&
      titleModalWindow === 'Are you sure you want to delete the test?'
    ) {
      removeTestAction(selectedTestItem.id);
      cleanInputs();
      setTestTitleValue('');
      setErrorTestTitle(false);
      removeAllQuestionAction();
      router.push('/admin/takeTests');
    }
    if (pathRouteCreate) {
      setTestTitleValue('');
      setInputValue('');
      setSelectType('none');
      setSelect('Select question type');
    }
    if (pathRouteEdit && selectedTestItem) {
      setTestTitleValue(selectedTestItem.title);
    }
  }, [modalFunctionOnClick, pathRouteCreate, selectedTestItem]);

  return (
    <div className={s.container}>
      <h2 className={s.title}>{pathRouteEdit ? 'Edit Test' : 'Create Test'}</h2>
      <div className={s.form}>
        <div className={cx(s['test-title'])}>
          <Input
            title={'Test Title:'}
            type={'text'}
            name={'name'}
            leftCheck={true}
            setInputValue={setTestTitleValue}
            error={errorTestTitle}
            value={testTitleValue}
          />
        </div>

        <div className={cx(s['test-title'])}>
          <Input
            title={'Question Title:'}
            type={'text'}
            name={'questionTitle'}
            leftCheck={true}
            value={inputValue}
            setInputValue={setInputValue}
            error={error}
          />
          <SelectField
            defaultValue={select}
            directionOptions={testsOptions}
            setSelect={setSelect}
            onChange={setSelectType}
            error={error}
          />
          <ChangeButton
            title={'Add question'}
            onClick={saveQuestionClickHandler}
          />
        </div>
        {pathRouteEdit
          ? selectedTestItem.questions.map(q => {
              return (
                <QuestionBox
                  key={q.id}
                  question={q}
                  takeTest={false}
                  setModalWindowIsOpen={setModalWindowIsOpen}
                  changeTitleModalWindow={changeTitleModalWindow}
                  modalFunctionOnClick={modalFunctionOnClick}
                  titleModalWindow={titleModalWindow}
                />
              );
            })
          : allQuestions.map(q => {
              return (
                <QuestionBox
                  key={q.id}
                  question={q}
                  takeTest={false}
                  setModalWindowIsOpen={setModalWindowIsOpen}
                  changeTitleModalWindow={changeTitleModalWindow}
                  modalFunctionOnClick={modalFunctionOnClick}
                  titleModalWindow={titleModalWindow}
                />
              );
            })}
        {errorList && (
          <span className={cx(s['error-message'])}>
            The list of questions should be at least two
          </span>
        )}
        <div className={s.buttons}>
          <ChangeButton
            title="Delete Test"
            onClick={() => {
              onClickHandlerDeleteTest();
            }}
          />
          {router.query.id && (
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
            onClick={onClickHandlerSaveTest}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CreateTests);
