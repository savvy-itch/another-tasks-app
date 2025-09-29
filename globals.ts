import { ColorTheme, TaskPriorities, themes } from "./types";

export const MAX_TASK_LENGTH = 70;
export const DAYS_TO_TASK_EXPIRATION = 7;
export const MAIN_BG = '#FBF3D5';
export const SUCCESS_COLOR = "#59AC77";
export const DANGER_COLOR = "#DC143C";

export const allThemes: Record<themes, ColorTheme> = {
  light: {
    mainBg: '#FBF3D5',
    textColor: '#222831',
    dayBg: '#fdf8e8ff',
    dayHighlightBg: '#a9f4beff',
    tabsBg: 'hsla(47, 80%, 95%, 1.00)',
    highlight: 'hsla(47, 45%, 85%, 1.00)',
  },
  dark: {
    mainBg: '#222831',
    textColor: '#F9F6F3',
    dayBg: 'hsla(217, 10%, 43%, 1.00)',
    dayHighlightBg: 'hsla(137, 88%, 61%, 0.7)',
    tabsBg: 'hsla(216, 18%, 21%, 1.00)',
    highlight: 'hsla(216, 18%, 25%, 1.00)',
  },
  green: {
    mainBg: 'hsla(112, 45%, 82%, 1.00)',
    textColor: '#222831',
    dayBg: 'hsla(112, 45%, 93%, 1.00)',
    dayHighlightBg: '#FFD6BA',
    tabsBg: 'hsla(112, 43%, 87%, 1.00)',
    highlight: 'hsla(112, 43%, 92%, 1.00)',
  }
}

export const BASE_FONT_SIZE = 18;
export const INDICATOR_SIZE = 17;
export const ALL_PRIORITIES: TaskPriorities[] = ["General", "Important"];
export const DAY_BTN_SIZE = 36;
