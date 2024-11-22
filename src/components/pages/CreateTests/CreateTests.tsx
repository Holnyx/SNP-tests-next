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
import { getCookie, setCookie } from 'cookies-next';

import { testsOptions } from '@/components/state/testsOptions';

import SelectField from '@/components/commons/SelectField/SelectField';
import Input from '@/components/commons/Inputs/Input/Input';
import ChangeButton from '@/components/commons/Buttons/ChangeButton/ChangeButton';
import QuestionBox from '@/components/commons/QuestionBox/QuestionBox';

import { QuestionItem, TestsItem, TestsOptionsForSelect } from '@/store/types';
import { useActionWithPayload } from '@/hooks/useAction';
import { addQuestion, removeAllQuestion } from '@/store/questionReduser';
import { addTest } from '@/store/testReduser';
import { questionSelector } from '@/store/selectors';

import s from './CreateTests.module.sass';
import cx from 'classnames';

type CreateTestsItems = {
  setModalWindowIsOpen: () => void;
  setTitleModalWindow: React.Dispatch<SetStateAction<string>>;
  openEditPage: (id: string) => void;
  selectedTestId: string;
  modalFunctionOnClick: boolean;
};

const CreateTests: FC<CreateTestsItems> = ({
  setModalWindowIsOpen,
  setTitleModalWindow,
  openEditPage,
  selectedTestId,
  modalFunctionOnClick,
}) => {
  const [select, setSelect] = useState('Select question type');
  const [selectType, setSelectType] = useState('none');
  const [testTitleValue, setTestTitleValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [errorTestTitle, setErrorTestTitle] = useState(false);
  const [error, setError] = useState(false);
  const [errorList, setErrorList] = useState(false);
  const router = useRouter();

  const addTestAction = useActionWithPayload(addTest);
  const removeAllQuestionAction = useActionWithPayload(removeAllQuestion);
  const addQuestionAction = useActionWithPayload(addQuestion);
  const allQuestions = useSelector(questionSelector);

  const checkQuestionValue =
    inputValue.length >= 3 && inputValue.trim() !== '' && selectType !== 'none';

  const checkTestTitleValue =
    testTitleValue.length >= 3 && testTitleValue.trim() !== '';

  const cleanInputs = useCallback(() => {
    setInputValue('');
    setSelectType('none');
    setSelect('Select question type');
  }, []);

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

  const onClickHandlerSaveTest = useCallback(() => {
    if (!checkTestTitleValue) {
      setErrorTestTitle(false);
    } else {
      setErrorTestTitle(true);
    }

    if (allQuestions.length < 2) {
      setErrorList(true);
    } else {
      setErrorList(false);
    }

    if (checkTestTitleValue && allQuestions.length >= 2) {
      setModalWindowIsOpen();
      changeTitleModalWindow(
        'Are you sure you want to save the changes?',
        'Are you sure you want to save the test?'
      );
    }
  }, [checkTestTitleValue, allQuestions.length]);

  const addTestHandler = useCallback(
    (test: TestsItem) => {
      if (!checkQuestionValue) {
        addTestAction(test);
        cleanInputs();
        setError(false);
      } else {
        setError(true);
      }
    },
    [addTestAction, checkQuestionValue, cleanInputs]
  );
  const saveTestClickHandler = useCallback(() => {
    const newTest: TestsItem = {
      id: v1(),
      title: testTitleValue,
      questions: allQuestions,
    };
    addTestHandler(newTest);
    console.log(newTest);
  }, [addTestHandler, testTitleValue, allQuestions]);

  const changeTitleModalWindow = (editTitle: string, createTitle: string) => {
    if (pathRouteEdit && error) {
      setTitleModalWindow(editTitle);
    } else if (pathRouteCreate) {
      setTitleModalWindow(createTitle);
    }
  };

  useEffect(() => {
    if (modalFunctionOnClick) {
      saveTestClickHandler();
      cleanInputs();
      setTestTitleValue('');
      setErrorTestTitle(false);
      removeAllQuestionAction();
    }
  }, [modalFunctionOnClick]);

  useEffect(() => {
    if (allQuestions.length >= 2) {
      setErrorList(false);
    }
  }, [allQuestions.length]);

  const pathRouteEdit = router.pathname === '/admin/editTest';
  const pathRouteCreate = router.pathname === '/admin/createTests';

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
            value={pathRouteEdit ? '11' : inputValue}
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
            onClick={() => {
              saveQuestionClickHandler();
            }}
          />
        </div>
        {allQuestions.map(q => {
          return (
            <QuestionBox
              key={q.id}
              question={q}
              takeTest={false}
              setModalWindowIsOpen={setModalWindowIsOpen}
              changeTitleModalWindow={changeTitleModalWindow}
              modalFunctionOnClick={modalFunctionOnClick}
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
            onClick={onClickHandlerSaveTest}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CreateTests);
