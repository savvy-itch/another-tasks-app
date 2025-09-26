import * as SQLite from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import { Alert } from 'react-native';
import { Languages, Migration, Task, TaskPriorities, themes } from "./types";

const TASKS_TABLE_NAME = "tasks";

export async function setFontSizePrefInStorage(val: number) {
  try {
    await Storage.setItem('fontSize', JSON.stringify({ fontSize: val }));
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

export async function setThemePrefInStorage(theme: themes) {
  try {
    await Storage.setItem('theme', JSON.stringify({ theme }));
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

export async function setLangPrefInStorage(lang: Languages) {
  try {
    await Storage.setItem('lang', JSON.stringify({ lang }));
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  }
}

const migrations: Migration[] = [
  async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`
        PRAGMA journal_mode = 'wal';
        CREATE TABLE ${TASKS_TABLE_NAME} (
          id INTEGER PRIMARY KEY NOT NULL, 
          text TEXT NOT NULL,
          created INTEGER NOT NULL,
          assignedDate INTEGER NOT NULL,
          notifDate INTEGER,
          notifId TEXT,
          isDone BOOLEAN DEFAULT 0,
        );
      `);
  },

  async (db: SQLite.SQLiteDatabase) => {
    await db.execAsync(`ALTER TABLE ${TASKS_TABLE_NAME} ADD COLUMN priority TEXT DEFAULT 'General'`);
  }
]

export async function migrateDb(db: SQLite.SQLiteDatabase) {
  try {
    let verRes = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentVersion = verRes?.user_version ?? 0;

    for (let v = currentVersion; v < migrations.length; v++) {
      await migrations[v](db);
    }

    await db.execAsync(`PRAGMA user_version = ${migrations.length}`);;
  } catch (error) {
    Alert.alert(String(error));
    console.error(error);
  } 
  // finally {
  //   console.log('migrateDb() called');
  // }
}

export async function deleteTasksForDayFromDb(db: SQLite.SQLiteDatabase, targetDate: Date) {
  try {
    let startMidnight = new Date(targetDate);
    startMidnight.setHours(0, 0, 0, 0);
    let endMidnight = new Date(targetDate);
    endMidnight.setHours(24, 0, 0, 0);
    await db.runAsync(`DELETE FROM ${TASKS_TABLE_NAME} WHERE assignedDate >= ? AND assignedDate < ?`, startMidnight.getTime(), endMidnight.getTime());
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addTaskToDb(db: SQLite.SQLiteDatabase, task: Omit<Task, "id">): Promise<Task> {
  try {
    await db.runAsync(`INSERT INTO ${TASKS_TABLE_NAME} (text, created, assignedDate, priority) VALUES (?, ?, ?, ?)`, task.text, task.created, task.assignedDate, task.priority);
    const rowId = await db.getFirstAsync<{ id: number }>(`SELECT last_insert_rowid() as id`);

    if (!rowId || typeof(rowId.id) !== 'number') {
      throw new Error("Failed to retrieve last_insert_rowid()");
    }

    return { ...task, id: rowId.id };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changePriorityInDb(db: SQLite.SQLiteDatabase, id: number, newPriority: TaskPriorities) {
  try {
    await db.runAsync(`UPDATE ${TASKS_TABLE_NAME} SET priority = ? WHERE id = ?`, [newPriority, id]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTaskFromDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync(`DELETE FROM ${TASKS_TABLE_NAME} WHERE id = ?`, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function toggleStatusInDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync(`UPDATE ${TASKS_TABLE_NAME} SET isDone = NOT isDone, notifDate = ?, notifId = ? WHERE id = ?`, null, null, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editTextInDb(db: SQLite.SQLiteDatabase, id: number, newText: string) {
  try {
    await db.runAsync(`UPDATE ${TASKS_TABLE_NAME} SET text = ? WHERE id = ?`, newText, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setNotifTimeInDb(db: SQLite.SQLiteDatabase, id: number, notifDate: number, notifId: string) {
  try {
    await db.runAsync(`UPDATE ${TASKS_TABLE_NAME} SET notifDate = ?, notifId = ? WHERE id = ?`, notifDate, notifId, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function cancelNotifInDb(db: SQLite.SQLiteDatabase, id: number) {
  try {
    await db.runAsync(`UPDATE ${TASKS_TABLE_NAME} SET notifDate = ?, notifId = ? WHERE id = ?`, null, null, id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function clearPrefsInStorage() {
  try {
    await Storage.removeItem('theme');
    await Storage.removeItem('fontSize');
    await Storage.removeItem('lang');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function clearDB(db: SQLite.SQLiteDatabase) {
  try {
    await db.execAsync(`
      BEGIN TRANSACTION;
      DROP TABLE IF EXISTS ${TASKS_TABLE_NAME};
      CREATE TABLE ${TASKS_TABLE_NAME} (
        id INTEGER PRIMARY KEY NOT NULL,
        text TEXT NOT NULL,
        created INTEGER NOT NULL,
        assignedDate INTEGER NOT NULL,
        notifDate INTEGER,
        notifId TEXT,
        isDone BOOLEAN DEFAULT 0,
        priority TEXT DEFAULT 'General'
      );
      PRAGMA user_version = ${migrations.length};
      COMMIT;
    `);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteExpiredTasksFromDb(db: SQLite.SQLiteDatabase, expDate: number) {
  try {
    await db.runAsync(`DELETE FROM ${TASKS_TABLE_NAME} WHERE assignedDate < ?`, expDate);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchAllTasksFromDb(db: SQLite.SQLiteDatabase) {
  try {
    const result = await db.getAllAsync<Task>(`SELECT * FROM ${TASKS_TABLE_NAME} ORDER BY assignedDate`);
    return result;
  } catch (error) {
    console.error(error + ' from fetchAllTasksFromDb()');
    throw error;
  }
}
