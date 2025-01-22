import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v1 } from 'uuid';
import { useRouter } from 'next/router';

import { testsOptions } from '@/components/state/testsOptions';
import SelectField from '@/components/commons/SelectField/SelectField';
import Input from '@/components/commons/Inputs/Input/Input';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';
import ModalWindow from '@/components/commons/ModalWindow/ModalWindow';
import Loader from '@/components/commons/Loader/Loader';

import {
  QuestionItem,
  TestForAdd,
  TestsItem,
  TestsOptionsForSelect,
} from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import {
  addQuestion,
  removeAllQuestion,
  removeQuestion,
} from '@/store/questionReducer';
import { loadingSelector, questionSelector } from '@/store/selectors';
import {
  createQuestionThunk,
  createTestThunk,
  deleteQuestionThunk,
  deleteTestThunk,
  updateTestThunk,
} from '@/thunk/testsThunk';
import { AppDispatch } from '@/store';

import s from './CreateTests.module.sass';
import cx from 'classnames';

type CreateTestsItems = {
  id?: string;
  selectedTestItem: TestsItem;
};

const CreateTests: FC<CreateTestsItems> = ({ id, selectedTestItem }) => {
  const [testDateValue, setTestDateValue] = useState(
    selectedTestItem.created_at
  );
  const [testTitleValue, setTestTitleValue] = useState(selectedTestItem.title);
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState(selectedTestItem.questions);
  const [select, setSelect] = useState('Select question type');
  const [selectType, setSelectType] = useState('none');
  const [isModalWindowOpen, setIsModalWindowOpen] = useState(false);
  const [isModalWindowTitle, setIsModalWindowTitle] = useState('');
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState(false);
  const [errorTestTitle, setErrorTestTitle] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const removeQuestionAction = useActionWithPayload(removeQuestion);
  const removeAllQuestionAction = useActionWithPayload(removeAllQuestion);
  const addQuestionAction = useActionWithPayload(addQuestion);

  const allQuestions = useSelector(questionSelector);
  const loading = useSelector(loadingSelector);

  const checkTestTitleValue =
    testTitleValue.length >= 3 && testTitleValue.trim() !== '';
  const checkQuestionValue =
    inputValue.length >= 3 && inputValue.trim() !== '' && selectType !== 'none';
  const isQuestionListValid =
    allQuestions.questionsList.length >= 2 ||
    selectedTestItem.questions.length >= 2;
  const hasAnswer = allQuestions.questionsList.every(question => {
    const hasEnoughAnswers =
      question.question_type === 'number'
        ? question.answers.length === 1
        : question.answers.length >= 2;
    const hasCorrectAnswer = question.answers.some(answer => answer.is_right);
    return hasEnoughAnswers && hasCorrectAnswer;
  });

  const pathRouteEdit = router.pathname.startsWith('/admin/edit-test');
  const pathRouteCreate = router.pathname === '/admin/create-tests';
  const pathRouteTakeTest = router.pathname.startsWith('/admin/test-page');

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
    if (!pathRouteCreate) {
      dispatch(deleteTestThunk(String(id)));
    }
    cleanInputs();
    setTestTitleValue('');
    setErrorTestTitle(false);
    removeAllQuestionAction();
    router.replace('/admin/take-tests');
  }, [dispatch, id]);

  const saveQuestionClickHandler = useCallback(() => {
    const newQuestion: QuestionItem = {
      id: v1(),
      title: inputValue,
      question_type: selectType as TestsOptionsForSelect,
      answers: [],
    };
    if (checkQuestionValue) {
      addQuestionAction(newQuestion);
      if (pathRouteEdit) {
        const questionData = {
          testId: String(id),
          data: {
            title: inputValue,
            question_type: selectType,
            answer: 0,
            answers: [],
          },
        };
        dispatch(createQuestionThunk(questionData)).then(response => {
          const newQuestion: QuestionItem = {
            id: response.payload.id,
            title: inputValue,
            question_type: selectType as TestsOptionsForSelect,
            answers: [],
          };
          setQuestions(prevQuestions => [newQuestion, ...prevQuestions]);
          cleanInputs();
          setError(false);
        });
      } else {
        setError(true);
      }
      cleanInputs();
      setError(false);
    } else {
      setError(true);
    }
  }, [checkQuestionValue, inputValue, selectType, dispatch, id, pathRouteEdit]);

  const removeQuestionHandler = useCallback(
    (questionId: string) => {
      if (pathRouteCreate) {
        removeQuestionAction({ questionId });
      } else {
        dispatch(deleteQuestionThunk(questionId)).then(() => {
          setQuestions(prevState =>
            prevState.filter(question => question.id !== questionId)
          );
        });
      }
    },
    [dispatch, removeQuestionAction, pathRouteCreate]
  );

  const onClickHandlerSaveTest = useCallback(() => {
    if (!checkTestTitleValue || !isQuestionListValid || !testTitleValue) {
      setErrorTestTitle(true);
      setErrorList(true);
    } else {
      setErrorTestTitle(false);
      setErrorList(false);
    }
    if (checkTestTitleValue && isQuestionListValid && hasAnswer && testTitleValue) {
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

  const createTest = useCallback(async () => {
    if (checkTestTitleValue && isQuestionListValid && hasAnswer && testTitleValue) {
      const answersData = allQuestions.questionsList.map(question => ({
        questionId: question.id,
        answers: question.answers || [],
      }));
      const testData: TestForAdd = {
        testTitle: testTitleValue,
        testsList: [],
        questionList: allQuestions.questionsList,
        answerList: answersData.flatMap(item => item.answers),
      };

      await dispatch(createTestThunk(testData));

      cleanInputs();
      setTestTitleValue('');
      setErrorTestTitle(false);
      dispatch(removeAllQuestion());
      router.replace('/admin/take-tests');
    }
  }, [
    dispatch,
    testTitleValue,
    questions,
    checkTestTitleValue,
    isQuestionListValid,
    hasAnswer,
  ]);

  const saveChange = useCallback(() => {
    if (checkTestTitleValue && isQuestionListValid && hasAnswer && testTitleValue) {
      if (selectedTestItem) {
        const updatedTitle =
          testTitleValue !== '' ? testTitleValue : selectedTestItem.title;
        const updatedDate =
          testDateValue !== '' ? testDateValue : selectedTestItem.created_at;
        const updateQuestions =
          questions.length >= 2 ? questions : selectedTestItem.questions;

        dispatch(
          updateTestThunk({
            id: String(id),
            updatedTest: {
              title: updatedTitle,
              created_at: updatedDate,
              questions: updateQuestions,
              id: String(id),
            },
          })
        );
        router.replace('/admin/take-tests');
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
    if (isModalWindowTitle.includes('save')) {
      if (pathRouteCreate) {
        createTest();
      } else if (pathRouteEdit) {
        saveChange();
      }
    } else if (isModalWindowTitle.includes('delete')) {
      deleteTest();
    } else if (isModalWindowTitle.includes('cancel')) {
      router.replace('/admin/take-tests');
    }
    setIsModalWindowOpen(false)
  }, [
    isModalWindowTitle,
    pathRouteCreate,
    pathRouteEdit,
    createTest,
    saveChange,
  ]);

  useEffect(() => {
    if (allQuestions.questionsList.length >= 2) {
      setErrorList(false);
    }
  }, [allQuestions.questionsList.length]);

  useEffect(() => {
    if (pathRouteCreate) {
      setTestTitleValue('');
      setInputValue('');
      setSelectType('none');
      setSelect('Select question type');
    }
    if (pathRouteEdit && selectedTestItem) {
      setTestTitleValue(selectedTestItem.title);
      setTestDateValue(selectedTestItem.created_at);
      setQuestions(selectedTestItem.questions);
    }
  }, [pathRouteCreate, pathRouteEdit, selectedTestItem]);

  return (
    <div className={s.container}>
      <h2 className={s.title}>{pathRouteEdit ? 'Edit Test' : 'Create Test'}</h2>
      <div className={s.form}>
        {loading && (
          <>
            <Loader />
            {allQuestions.questionsList.length !== 0 && (
              <div>test is created</div>
            )}
          </>
        )}
        {!loading && (
          <>
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
            {pathRouteEdit && selectedTestItem
              ? questions.map(q => {
                  return (
                    <QuestionBox
                      key={q.id}
                      questionId={q.id}
                      question={q}
                      takeTest={pathRouteTakeTest}
                      removeQuestionHandler={() => removeQuestionHandler(q.id)}
                      questions={selectedTestItem.questions}
                      onAnswerSelect={() => {}}
                    />
                  );
                })
              : allQuestions.questionsList.map(q => (
                  <QuestionBox
                    questionId={q.id}
                    key={q.id}
                    question={q}
                    takeTest={pathRouteTakeTest}
                    removeQuestionHandler={() => removeQuestionHandler(q.id)}
                    questions={questions}
                    onAnswerSelect={() => {}}
                  />
                ))}
            {errorList && !isQuestionListValid && (
              <span className={cx(s['error-message'])}>
                The list of questions should be at least two
              </span>
            )}
            <div className={s.buttons}>
              <ChangeButton
                title="Delete Test"
                onClick={onClickHandlerDeleteTest}
              />
              <ChangeButton
                title="Save Test"
                onClick={onClickHandlerSaveTest}
              />
            </div>
          </>
        )}
      </div>
      <ModalWindow
        isModalWindowOpen={isModalWindowOpen}
        onClose={() => setIsModalWindowOpen(false)}
        onConfirm={onConfirm}
        title={isModalWindowTitle}
      />
    </div>
  );
};

export default memo(CreateTests);
