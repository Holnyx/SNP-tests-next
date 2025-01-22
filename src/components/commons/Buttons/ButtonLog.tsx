import React, { FC, memo } from 'react';

type ButtonLogItems = {
  title: string;
  className: string;
  onClick: () => void;
};

const ButtonLog: FC<ButtonLogItems> = ({ title, className, onClick }) => {
  return (
    <>
      <button
        className={className}
        onClick={onClick}
      >
        {title}
      </button>
    </>
  );
};

export default memo(ButtonLog);
