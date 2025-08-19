import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { Task } from "./types";

/*
+ fetch all tasks
+ add new task
! edit task (text, notification, status, notif)
  + mark/unmark as done
  + edit text
  - edit notification
  - delete notification
- display notification time next to the task
+ delete task
+ fetch daily tasks
- create notification time picker
- allow to choose notif time
- delete tasks after 7 days
- move completed tasks to the bottom of the list
- calendar
- settings:
  - themes
- sort task from undone to done and dynamically change their place once they're done/undone
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
    await db.runAsync('UPDATE tasks SET isDone = NOT isDone WHERE id = ?', id);
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

export async function setNotifTimeInDb(db: SQLite.SQLiteDatabase, id: number, notifDate: number) {
  try {
    await db.runAsync('UPDATE tasks SET notifDate = ? WHERE id = ?', notifDate, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
