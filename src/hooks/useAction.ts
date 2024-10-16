import { useDispatch } from 'react-redux';
import { PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';

export const useActionWithPayload = <T>(
  action: (...args: any[]) => PayloadAction<T>
) => {
  const dispatch = useDispatch();
  const handler = useCallback(
    (...args: any[]) => {
      dispatch(action(...args));
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
