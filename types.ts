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
  priority: TaskPriorities,
};

export type TaskPriorities = "General" | "Important";

interface TasksContextType {
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  fetchAllTasks: (db: SQLite.SQLiteDatabase) => void,
  addTask: (db: SQLite.SQLiteDatabase, task: Omit<Task, "id">) => void,
  deleteTask: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  deleteAllTasksForDay: (db: SQLite.SQLiteDatabase, targetDate: Date) => void,
  toggleStatus: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  editText: (db: SQLite.SQLiteDatabase, taskId: number, newText: string) => void,
  setNotifTime: (db: SQLite.SQLiteDatabase, taskId: number, notifDate: number, notifId: string) => void,
  deleteNotif: (db: SQLite.SQLiteDatabase, taskId: number, notifId: string) => void,
  deleteExpiredTasks: (db: SQLite.SQLiteDatabase) => void,
  clearData: (db: SQLite.SQLiteDatabase) => void,
  changePriority: (db: SQLite.SQLiteDatabase, id: number, newPriority: TaskPriorities) => void
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
  setLangPref: (lang: Languages) => void,
  clearPrefs: () => void,
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
  tabsBg: string,
  highlight: string,
}

export interface LanguageObject {
  langName: string,
  today: string,
  calendar: string,
  settings: string,
  save: string,
  cancel: string,
  ok: string,
  newTaskPlaceholder: string,
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
    clearDataDialog: string,
  },
  noTasks: string,
  task: {
    edit: string,
    delete: string,
    reminder: string,
    deleteReminder: string,
    changePriority: string,
  },
  priorities: {
    General: string,
    Important: string,
  },
  priority: string,
  deleteTasksForDayDialog: string,
  deleteTasksSuccessMsg: string,
}

export type Migration = (db: SQLite.SQLiteDatabase) => Promise<void>;
