import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { Task } from "./types";

/*
+ fetch all tasks
+ add new task
- edit task (text, notification, status, notif)
+ delete task
+ fetch daily tasks
- delete tasks after 7 days
*/

export async function migrateDb(db: SQLite.SQLiteDatabase) {
  try {    
    const DB_VERSION = 1;
    const result = await db?.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    let currentDbVersion = result?.user_version ?? 0;
  
    if (currentDbVersion >= DB_VERSION) return;
  
    if (currentDbVersion === 0) {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          text TEXT NOT NULL, 
          created INTEGER NOT NULL,
          assignedDate INTEGER NOT NULL,
          notifDate INTEGER,
          isDone BOOLEAN DEFAULT 0
        );
      `);
    }
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

export async function fetchTodaysTasks(db: SQLite.SQLiteDatabase) {
  try {
    const curDate = new Date(Date.now());
    let startMidnight = new Date(curDate);
    startMidnight.setHours(0, 0, 0, 0);
    let endMidnight = new Date(curDate);
    endMidnight.setHours(24, 0, 0, 0);
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE assignedDate >= ? AND assignedDate < ? ORDER BY assignedDate', startMidnight.getTime(), endMidnight.getTime());
    return result;
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

export async function addTaskToDb(db: SQLite.SQLiteDatabase, task: Task) {
  try {
    await db.runAsync('INSERT INTO tasks (text, created, assignedDate) VALUES (?, ?, ?)', task.text, task.created, task.assignedDate);
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

export async function deleteTaskFromDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync('DELETE FROM tasks WHERE id = $id', { $id: id });
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}
