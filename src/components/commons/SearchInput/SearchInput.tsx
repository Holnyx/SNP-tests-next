import React, { FC, memo } from 'react';
import Image from 'next/image';

import starUrl from '/public/img/loupe-icon.svg?url';
import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './SearchInput.module.sass';
import cx from 'classnames';

type SearchInputItems = {};

const SearchInput: FC<SearchInputItems> = ({}) => {
  return (
    <div className={s['container']}>
      <label
        htmlFor="search"
        className={s.icon}
      >
        <Image
          src={starUrl}
          alt={'loupe-icon'}
          priority
        />
      </label>
      <input
        id="search"
        type="text"
        placeholder={'Search'}
        className={s.input}
      ></input>
      <button
        className={s['clear-button']}
        title="Cancel"
        // onClick={clearInput}
      >
        <Image
          className={s['clear-icon']}
          src={deleteIconUrl}
          alt={'Clear'}
        />
      </button>
    </div>
  );
};

export default memo(SearchInput);
