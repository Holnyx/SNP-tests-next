import React, { FC, memo } from 'react';

type ButtonLogProps = {
  title: string;
  className: string;
  onClick: () => void;
};

const ButtonLog: FC<ButtonLogProps> = ({ title, className, onClick }) => {
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
