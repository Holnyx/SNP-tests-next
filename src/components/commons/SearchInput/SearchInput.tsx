import React, { ChangeEvent, FC, memo, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import starUrl from '/public/img/loupe-icon.svg?url';
import deleteIconUrl from '/public/img/delete-icon.svg?url';

import s from './SearchInput.module.sass';

type SearchInputProps = {
  setSearchTerm: (v: string) => void;
  defaultValue: string;
  onSearchChange: (query: string) => void;
  clearSearchInput: (payload: string) => void;
};

const SearchInput: FC<SearchInputProps> = ({
  setSearchTerm,
  defaultValue,
  onSearchChange,
  clearSearchInput,
}) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const router = useRouter();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.currentTarget.value);
    setInputValue(event.currentTarget.value);
    setSearchTerm(event.currentTarget.value);
    if (!event.currentTarget.value) {
      clearSearchInput('');
      if (router.pathname.includes('admin')) {
        router.replace('/admin/take-tests');
      } else if (router.pathname.includes('user')) {
        router.replace('/user/take-tests');
      }
    } else {
      clearSearchInput(event.currentTarget.value);
    }
  };

  const clearInput = () => {
    setSearchTerm('');
    setInputValue('');
    clearSearchInput('');
    // if (router.pathname.includes('admin')) {
    //   router.replace('/admin/take-tests', undefined, { shallow: true });
    // } else if (router.pathname.includes('user')) {
    //   router.replace('/user/take-tests', undefined, { shallow: true });
    // }
  };

  useEffect(() => {
    setInputValue(defaultValue);
    clearSearchInput(defaultValue);
  }, [clearSearchInput, defaultValue]);

  return (
    <div className={s['container']}>
      <label
        className={s.icon}
        htmlFor="search"
      >
        <Image
          alt={'loupe-icon'}
          src={starUrl}
        />
      </label>
      <input
        className={s.input}
        id="search"
        placeholder={'Search'}
        type="text"
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
            alt={'Clear'}
            className={s['clear-icon']}
            src={deleteIconUrl}
          />
        </button>
      )}
    </div>
  );
};

export default memo(SearchInput);
