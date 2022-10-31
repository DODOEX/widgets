import { store } from '..';

export const getLanguage = () => {
  return store.getState().settings.language;
};

export const getColorMode = () => {
  return store.getState().settings.colorMode;
};
