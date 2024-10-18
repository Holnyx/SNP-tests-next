import React, { FC, memo } from 'react';

type ButtonLogItems = {
  getTitle: string;
  getClassName: string;
};

const ButtonLog: FC<ButtonLogItems> = ({ getTitle, getClassName }) => {
  return (
    <>
      <button className={getClassName}>{getTitle}</button>
    </>
  );
};

export default memo(ButtonLog);
