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
  notifDate?: number,
  isDone: Bool
};

interface TasksContextType {
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  addTask: (db: SQLite.SQLiteDatabase, task: Task) => void,
  deleteTask: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  toggleStatus: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  fetchTodaysTasks: (db: SQLite.SQLiteDatabase) => void,
  editText: (db: SQLite.SQLiteDatabase, taskId: number, newText: string) => void,
  setNotifTime: (db: SQLite.SQLiteDatabase, taskId: number, notifDate: number) => void,
}

export {
  Bool,
  Task,
  TasksContextType
};

