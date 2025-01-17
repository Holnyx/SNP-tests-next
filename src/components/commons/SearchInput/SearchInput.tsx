import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/loupe-icon.svg?url';
import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './SearchInput.module.sass';
import cx from 'classnames';

type SearchInputItems = {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  defaultValue: string;
  onSearchChange: (query: string) => void;
  clearSearchInput: (payload: string) => void;
};

const SearchInput: FC<SearchInputItems> = ({
  setSearchTerm,
  defaultValue,
  onSearchChange,
  clearSearchInput,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const router = useRouter();
  const currentPath = router.pathname;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.currentTarget.value);
    setInputValue(event.currentTarget.value);
    setSearchTerm(event.currentTarget.value);
    if (!event.currentTarget.value) {
      clearSearchInput('');
      if (currentPath.includes('admin')) {
        router.replace('/admin/takeTests');
      } else if (currentPath.includes('user')) {
        router.replace('/user/takeTests');
      }
    } else {
      clearSearchInput(event.currentTarget.value);
    }
  };

  const clearInput = () => {
    setSearchTerm('');
    setInputValue('');
    clearSearchInput('');
    if (currentPath.includes('admin')) {
      router.replace('/admin/takeTests');
    } else if (currentPath.includes('user')) {
      router.replace('/user/takeTests');
    }
  };

  useEffect(() => {
    setInputValue(defaultValue);
    clearSearchInput(defaultValue);
  }, [defaultValue]);

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
        value={inputValue}
        onChange={handleChange}
      ></input>
      {inputValue && (
        <button
          className={s['clear-button']}
          title="Cancel"
          onClick={clearInput}
        >
          <Image
            className={s['clear-icon']}
            src={deleteIconUrl}
            alt={'Clear'}
          />
        </button>
      )}
    </div>
  );
};

export default memo(SearchInput);
