import React, { FC, memo } from 'react';

type InputForLogInItems = {
  getTitle: string;
  getType: string;
  getName: string;
  getClassName: string;
};

const InputForLogIn: FC<InputForLogInItems> = ({
  getTitle,
  getType,
  getName,
  getClassName,
}) => {
  return (
    <>
      <label htmlFor={getName}>{getTitle}</label>
      <input
        className={getClassName}
        type={getType}
        name={getName}
      />
    </>
  );
};

export default memo(InputForLogIn);
