/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from 'react-redux';
import { AsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { AppDispatch } from '@/store';

export const useActionWithPayload = <T>(
  action: (...args: any[]) => PayloadAction<T>
) => {
  const dispatch = useDispatch<AppDispatch>();
  const handler = useCallback(
    (...args: any[]) => {
      dispatch(action(...args));
    },
    [dispatch, action]
  );

  return handler;
};

export const useActionAsyncWithPayload = <T extends any[]>(
  action: AsyncThunk<any, T[0], any> | ((...args: T) => PayloadAction<any>)
) => {
  const dispatch = useDispatch<AppDispatch>();
  const handler = useCallback(
    (...args: T) => {
      dispatch(action({ ...args }));
    },
    [dispatch, action]
  );

  return handler;
};

export const useAction = (action: () => PayloadAction<undefined>) => {
  const dispatch = useDispatch();

  const handler = useCallback(() => {
    dispatch(action());
  }, [dispatch, action]);

  return handler;
};
