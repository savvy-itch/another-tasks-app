import * as SQLite from 'expo-sqlite';

interface Task {
  id: number,
  text: string,
  created: number, // which day task is associated with
  assignedDate: number,
  notifDate?: number,
  isDone: boolean
};

interface TasksContextType {
  tasks: Task[],
  setTasks: (tasks: Task[]) => void,
  addTask: (db: SQLite.SQLiteDatabase, task: Task) => void,
  deleteTask: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  toggleStatus: (db: SQLite.SQLiteDatabase, taskId: number) => void,
  fetchTodaysTasks: (db: SQLite.SQLiteDatabase) => void,
}

export {
  Task,
  TasksContextType
};

