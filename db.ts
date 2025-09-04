import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { Task } from "./types";

export async function migrateDb(db: SQLite.SQLiteDatabase) {
  try {
    const DB_VERSION = 2;
    // const result = await db?.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    // let currentDbVersion = result?.user_version ?? 0;

    const tableExists = await db.getFirstAsync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';"
    );

    // if (currentDbVersion >= DB_VERSION) return;

    if (!tableExists) {
      await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
          text TEXT NOT NULL, 
          created INTEGER NOT NULL,
          assignedDate INTEGER NOT NULL,
          notifDate INTEGER,
          notifId TEXT,
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

export async function fetchTodaysTasksFromDb(db: SQLite.SQLiteDatabase) {
  try {
    const curDate = new Date(Date.now());
    let startMidnight = new Date(curDate);
    startMidnight.setHours(0, 0, 0, 0);
    let endMidnight = new Date(curDate);
    endMidnight.setHours(24, 0, 0, 0);
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE assignedDate >= ? AND assignedDate < ? ORDER BY assignedDate', startMidnight.getTime(), endMidnight.getTime());
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchTasksForDayFromDb(db: SQLite.SQLiteDatabase, targetDate: Date) {
  try {
    let startMidnight = new Date(targetDate);
    startMidnight.setHours(0, 0, 0, 0);
    let endMidnight = new Date(targetDate);
    endMidnight.setHours(24, 0, 0, 0);
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks WHERE assignedDate >= ? AND assignedDate < ? ORDER BY assignedDate', startMidnight.getTime(), endMidnight.getTime());
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addTaskToDb(db: SQLite.SQLiteDatabase, task: Task) {
  try {
    await db.runAsync('INSERT INTO tasks (text, created, assignedDate) VALUES (?, ?, ?)', task.text, task.created, task.assignedDate);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTaskFromDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync('DELETE FROM tasks WHERE id = $id', { $id: id });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleStatusInDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync('UPDATE tasks SET isDone = NOT isDone, notifDate = ?, notifId = ? WHERE id = ?', null, null, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editTextInDb(db: SQLite.SQLiteDatabase, id: number, newText: string) {
  try {
    await db.runAsync('UPDATE tasks SET text = ? WHERE id = ?', newText, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setNotifTimeInDb(db: SQLite.SQLiteDatabase, id: number, notifDate: number, notifId: string) {
  try {
    await db.runAsync('UPDATE tasks SET notifDate = ?, notifId = ? WHERE id = ?', notifDate, notifId, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function cancelNotifInDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync('UPDATE tasks SET notifDate = ?, notifId = ? WHERE id = ?', null, null, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function clearDB(db: SQLite.SQLiteDatabase) {
  try {
    await db.runAsync('DROP TABLE IF EXISTS tasks;');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteExpiredTasksFromDb(db: SQLite.SQLiteDatabase, expDate: number) {
  try {
    await db.runAsync('DELETE FROM tasks WHERE assignedDate < ?', expDate);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAllTasksFromDb(db: SQLite.SQLiteDatabase) {
  try {
    const result = await db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY assignedDate');
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
