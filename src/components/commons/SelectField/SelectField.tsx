import React, { ChangeEvent, Dispatch, FC, memo, SetStateAction, useState } from 'react';
import { TestsOptionsItem } from '@/components/state/testsOptions';

import s from './SelectField.module.sass';
import cx from 'classnames';
import { TestsOptionsForSelect } from '@/store/types';

type SelectFieldPropsItem = {
  defaultValue: string;
  directionOptions: TestsOptionsItem[];
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  onChange: Dispatch<SetStateAction<string>>
};

const SelectField: FC<SelectFieldPropsItem> = ({
  defaultValue,
  directionOptions,
  setSelect,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: TestsOptionsItem) => {
    setSelect(option.title);
    setIsOpen(false);
    onChange(option.value)
  };

  return (
    <div className={s['dropdown']}>
      <div
        className={s['dropdown--header']}
        onClick={toggleDropdown}
      >
        {defaultValue}
        <span
          className={cx(s['dropdown--arrow'], {
            [s['dropdown--open']]: isOpen,
          })}
        ></span>
      </div>
      {isOpen && (
        <div className={s['dropdown--options']}>
          {directionOptions.map(
            (option, index) =>
              !option.disabled && (
                <div
                  key={index}
                  className={cx(s['dropdown--option'], {
                    [s['selected']]: option.title === defaultValue,
                  })}
                  onClick={() => handleSelect(option)}
                >
                  {option.title}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};
export default memo(SelectField);
