import * as SQLite from 'expo-sqlite';

enum Bool {
  TRUE = 1,
  FALSE = 0,
}

interface Task {
  id: number,
  text: string,
  created: number, // which day task is associated with
  assignedDate: number,
  notifDate?: number | null,
  notifId?: string | null,
  isDone: Bool,
};

interface TasksContextType {
  tasks: Task[],
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setTasks: (tasks: Task[]) => void,
  fetchAllTasks: (db: SQLite.SQLiteDatabase) => void,
  addTask: (db: SQLite.SQLiteDatabase, task: Task) => void,
  deleteTask: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  toggleStatus: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  fetchTodaysTasks: (db: SQLite.SQLiteDatabase) => void,
  fetchTasksForDay: (db: SQLite.SQLiteDatabase, targetDate: Date) => void,
  editText: (db: SQLite.SQLiteDatabase, taskId: number, newText: string) => void,
  setNotifTime: (db: SQLite.SQLiteDatabase, taskId: number, notifDate: number, notifId: string) => void,
  deleteNotif: (db: SQLite.SQLiteDatabase, taskId: number, notifId: string) => void,
  deleteExpiredTasks: (db: SQLite.SQLiteDatabase) => void,
};

interface GeneralContextType {
  openDropdownId: number,
  fontSize: number,
  curTheme: themes,
  language: Languages,
  setOpenDropdownId: React.Dispatch<React.SetStateAction<number>>,
  setFontSizePref: (val: number) => void,
  fetchAppPrefs: () => void,
  setThemePref: (theme: themes) => void,
  setLangPref: (lang: Languages) => void
}

export type themes = "light" | "dark" | "green";
export type Languages = "en" | "uk" | "ru";

export {
  Bool, GeneralContextType, Task,
  TasksContextType
};

export interface ColorTheme {
  mainBg: string,
  textColor: string,
  dayBg: string,
  dayHighlightBg: string,
}

export interface LanguageObject {
  langName: string,
  today: string,
  calendar: string,
  settings: string,
  save: string,
  cancel: string,
  weekdays: string[],
  settingsTab: {
    fontSize: string,
    normal: string,
    large: string,
    theme: string,
    language: string,
    selectLanguage: string,
    clearData: string,
    appVersion: string,
  },
  noTasks: string,
}
