import React, { FC, memo, useCallback, useEffect, useState } from 'react';
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
import { addTest, removeTest, updateTests } from '@/store/testReduser';
import { questionSelector } from '@/store/selectors';

import s from './CreateTests.module.sass';
import cx from 'classnames';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';

type CreateTestsItems = {
  id?: string;
  selectedTestItem: TestsItem;
};

const CreateTests: FC<CreateTestsItems> = ({ id, selectedTestItem }) => {
  const [select, setSelect] = useState('Select question type');
  const [selectType, setSelectType] = useState('none');
  const [testTitleValue, setTestTitleValue] = useState(selectedTestItem.title);
  const [testDateValue, setTestDateValue] = useState(selectedTestItem.date);
  const [inputValue, setInputValue] = useState('');
  const [errorTestTitle, setErrorTestTitle] = useState(false);
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState(false);

  const [questions, setQuestions] = useState(selectedTestItem.questions);

  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [isModalWindowTitle, setIsModalWindowTitle] = useState('');

  const router = useRouter();
  const addTestAction = useActionWithPayload(addTest);
  const removeAllQuestionAction = useActionWithPayload(removeAllQuestion);
  const addQuestionAction = useActionWithPayload(addQuestion);
  const removeTestAction = useActionWithPayload(removeTest);
  const updateTestAction = useActionWithPayload(updateTests);
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
    setIsModalWindowTitle('Are you sure you want to delete the test?');
    setIsModalWindowOpen(true);
  }, [setIsModalWindowTitle, setIsModalWindowOpen]);

  const deleteTest = useCallback(() => {
    removeTestAction({ id });
    cleanInputs();
    setTestTitleValue('');
    setErrorTestTitle(false);
    removeAllQuestionAction();
    router.push('/admin/takeTests');
  }, [removeTestAction, id]);

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
    setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
  }, [addQuestionHandler, inputValue, selectType]);

  const saveTestClickHandler = useCallback(() => {
    const newTest: TestsItem = {
      id: v1(),
      title: testTitleValue,
      date: new Date().toISOString(),
      questions: allQuestions,
    };
    if (checkTestTitleValue) {
      addTestAction(newTest);
      cleanInputs();
      setError(false);
    } else {
      setError(true);
    }
  }, [checkTestTitleValue, cleanInputs, testTitleValue, allQuestions]);

  const onClickHandlerSaveTest = useCallback(() => {
    if (!checkTestTitleValue || !isQuestionListValid) {
      setErrorTestTitle(true);
      setErrorList(true);
    } else {
      setErrorTestTitle(false);
      setErrorList(false);
    }
    if (checkTestTitleValue && isQuestionListValid && hasAnswer) {
      setIsModalWindowOpen(true);
      setIsModalWindowTitle('Are you sure you want to save the test?');
    }
  }, [
    checkTestTitleValue,
    isQuestionListValid,
    hasAnswer,
    setIsModalWindowOpen,
    setIsModalWindowTitle,
  ]);

  const createTest = useCallback(() => {
    saveTestClickHandler();
    cleanInputs();
    setTestTitleValue('');
    setErrorTestTitle(false);
    removeAllQuestionAction();
    router.push('/admin/takeTests');
  }, [saveTestClickHandler]);

  const saveChange = useCallback(() => {
    if (checkTestTitleValue && isQuestionListValid && hasAnswer) {
      if (selectedTestItem) {
        const updatedTitle =
          testTitleValue !== '' ? testTitleValue : selectedTestItem.title;
        const updatedDate =
          testDateValue !== '' ? testDateValue : selectedTestItem.date;
        const updateQuestions =
          questions.length >= 2 ? questions : selectedTestItem.questions;
        updateTestAction({
          id,
          title: updatedTitle,
          date: updatedDate,
          questions: updateQuestions,
        });
        router.push('/admin/takeTests');
      }
    }
  }, [
    selectedTestItem,
    testTitleValue,
    testDateValue,
    questions,
    checkTestTitleValue,
    isQuestionListValid,
    hasAnswer,
  ]);

  const onConfirm = useCallback(() => {
    if (isModalWindowTitle.includes('save') && pathRouteCreate) {
      createTest();
    } else if (isModalWindowTitle.includes('delete')) {
      deleteTest();
    } else if (isModalWindowTitle.includes('cancel')) {
      router.push('/admin/takeTests');
    } else if (isModalWindowTitle.includes('save') && pathRouteEdit) {
      saveChange();
    }
  }, [isModalWindowTitle]);

  useEffect(() => {
    if (allQuestions.length >= 2) {
      setErrorList(false);
    }
  }, [allQuestions.length]);

  useEffect(() => {
    if (pathRouteCreate) {
      setTestTitleValue('');
      setInputValue('');
      setSelectType('none');
      setSelect('Select question type');
    }
    if (pathRouteEdit && selectedTestItem) {
      setTestTitleValue(selectedTestItem.title);
      setTestDateValue(new Date().toISOString());
      setQuestions(selectedTestItem.questions);
    }
  }, [pathRouteCreate, pathRouteEdit, selectedTestItem]);

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
          ? questions.map(q => (
              <QuestionBox
                key={q.id}
                questionId={q.id}
                question={q}
                takeTest={false}
                setQuestions={setQuestions}
              />
            ))
          : allQuestions.map(q => (
              <QuestionBox
              questionId={q.id}
                key={q.id}
                question={q}
                takeTest={false}
                setQuestions={setQuestions}
              />
            ))}
        {errorList && (
          <span className={cx(s['error-message'])}>
            The list of questions should be at least two
          </span>
        )}
        <div className={s.buttons}>
          <ChangeButton
            title="Delete Test"
            onClick={onClickHandlerDeleteTest}
          />
          {router.query.id && (
            <ChangeButton
              title="Cancel Changes"
              onClick={() => {
                setIsModalWindowOpen(true);
                setIsModalWindowTitle(
                  'Are you sure you want to cancel the changes?'
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
      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        setIsModalWindowOpen={setIsModalWindowOpen}
        onConfirm={onConfirm}
        title={isModalWindowTitle}
      />
    </div>
  );
};

export default memo(CreateTests);
