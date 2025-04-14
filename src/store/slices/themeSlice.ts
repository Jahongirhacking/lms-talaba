import {
  getLocalStorage,
  localStorageNames,
  setLocalStorage,
} from '@/utils/storageFunc';
import { createSlice } from '@reduxjs/toolkit';

interface IState {
  color: 'dark' | 'light';
}
const initialState: IState = {
  color: getLocalStorage(localStorageNames.theme)
    ? (getLocalStorage(localStorageNames.theme) as IState).color
    : 'light',
};

const themeSlice = createSlice({
  name: 'themeSlice',
  initialState: initialState,
  reducers: {
    toggleThemeColor: state => {
      state.color = state.color === 'light' ? 'dark' : 'light';
      setLocalStorage(localStorageNames.theme, state);
    },
  },
});

export const { toggleThemeColor } = themeSlice.actions;
export default themeSlice.reducer;
