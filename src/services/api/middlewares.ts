import { localStorageNames } from '@/utils/storageFunc';
import type { Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { message } from 'antd';
import { t } from 'i18next';

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  // (api: MiddlewareAPI) => (next) => (action: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => next => (action: any) => {
    // RTK Query uses createAsyncThunk from redux-toolkit under the hood, so we're able to utilize these matchers!
    const status = action.payload?.originalStatus;
    const errors = action.payload?.data?.errors ?? action.payload?.data ?? '';

    if (isRejectedWithValue(action)) {
      const error_message =
        action.payload?.data?.message ??
        action.payload?.data?.msg ??
        action.payload?.data?.err?.message ??
        action.payload?.data?.error ??
        '';

      if (error_message && error_message !== 'A validation error occurred.') {
        message.warning(error_message);
        if (
          error_message ===
          'Your request was made with invalid or expired JSON Web Token.'
        ) {
          localStorage.removeItem(localStorageNames.HEMIS_TOKEN);
          window.location.href = '/';
        }
      }

      if (errors.length > 0) {
        errors?.forEach((item: string) => {
          item && message.warning(item);
        });
      }

      if (status === 500) {
        message.warning(
          "Server bilan bog'liq xatolik. Iltimos bu haqida ma'sul xodimlarga xabar bering"
        );
      } else if (status === 401 || status === 403) {
        window.location.href = '/auth/signin';
        message.warning('Iltimos avval tizimga kiring!');
      } else if (action.payload.status === 'FETCH_ERROR') {
        message.warning(
          `${t('const.sorry')}, ${t('const.problem_with_server')} ${t('const.try_again_later')}`
        );
      }
    }

    return next(action);
  };
