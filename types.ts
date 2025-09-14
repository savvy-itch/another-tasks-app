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
  setOpenDropdownId: React.Dispatch<React.SetStateAction<number>>,
  setFontSizePref: (val: number) => void,
  fetchAppPrefs: () => void
}

export {
  Bool, GeneralContextType, Task,
  TasksContextType
};

