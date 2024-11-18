import React, { FC, memo } from 'react';

type ButtonLogItems = {
  getTitle: string;
  getClassName: string;
  onClick: () => void;
};

const ButtonLog: FC<ButtonLogItems> = ({ getTitle, getClassName, onClick }) => {
  return (
    <>
      <button
        className={getClassName}
        onClick={onClick}
      >
        {getTitle}
      </button>
    </>
  );
};

export default memo(ButtonLog);
