import { ColorTheme, themes } from "./types";

export const MAX_TASK_LENGTH = 50;
export const DAYS_TO_TASK_EXPIRATION = 7;
export const MAIN_BG = '#FBF3D5';

export const allThemes: Record<themes, ColorTheme> = {
  light: {
    mainBg: '#FBF3D5',
    textColor: '#222831',
    dayBg: '#fdf8e8ff',
    dayHighlightBg: '#a9f4beff',
  },
  dark: {
    mainBg: '#222831',
    textColor: '#F9F6F3',
    dayBg: 'hsla(217, 10%, 43%, 1.00)',
    dayHighlightBg: 'hsla(137, 88%, 61%, 0.7)',
  },
  green: {
    mainBg: 'hsla(112, 45%, 82%, 1.00)',
    textColor: '#222831',
    dayBg: 'hsla(112, 45%, 93%, 1.00)',
    dayHighlightBg: '#FFD6BA',
  }
}

export const BASE_FONT_SIZE = 18;
