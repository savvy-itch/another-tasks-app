import { addTaskToDb, cancelNotifInDb, changePriorityInDb, clearDB, deleteExpiredTasksFromDb, deleteTaskFromDb, deleteTasksForDayFromDb, editTextInDb, fetchAllTasksFromDb, setNotifTimeInDb, toggleStatusInDb } from "@/db";
import { DAYS_TO_TASK_EXPIRATION } from '@/globals';
import { Bool, Task, TaskPriorities, TasksContextType } from "@/types";
import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useState } from "react";
import { Alert } from 'react-native';

export const TasksContext = createContext<TasksContextType | null>(null);

interface TasksProviderProps {
  children: React.ReactNode;
}

export default function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function fetchAllTasks(db: SQLite.SQLiteDatabase) {
    try {
      const res = await fetchAllTasksFromDb(db);
      setTasks(res);
    } catch (error) {
      Alert.alert(String(error) + 'from fetchAllTasks()');
    } finally {
      // console.log('fetchAllTask()');
    }
  }

  async function addTask(db: SQLite.SQLiteDatabase, newTask: Omit<Task, "id">) {
    try {
      const newTaskWithId = await addTaskToDb(db, newTask);
      setTasks(prev => [...prev, newTaskWithId]);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function changePriority(db: SQLite.SQLiteDatabase, id: number, newPriority: TaskPriorities) {
    try {
      await changePriorityInDb(db, id, newPriority);
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, priority: newPriority } : t
        ));
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function deleteTask(db: SQLite.SQLiteDatabase, id: number) {
    try {
      await deleteTaskFromDb(db, id);
      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function deleteAllTasksForDay(db: SQLite.SQLiteDatabase, targetDate: Date) {
    try {
      await deleteTasksForDayFromDb(db, targetDate);
      let startMidnight = new Date(targetDate);
      startMidnight.setHours(0, 0, 0, 0);
      let endMidnight = new Date(targetDate);
      endMidnight.setHours(24, 0, 0, 0);
      const updatedTasks = tasks.filter(t => t.assignedDate < startMidnight.getTime() || t.assignedDate >= endMidnight.getTime());
      setTasks(updatedTasks);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function toggleStatus(db: SQLite.SQLiteDatabase, id: number) {
    try {
      await toggleStatusInDb(db, id);
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? {
            ...t,
            isDone: t.isDone ? Bool.FALSE : Bool.TRUE,
            notifDate: null,
            notifId: null,
          } : t
        ));
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function editText(db: SQLite.SQLiteDatabase, id: number, newText: string) {
    try {
      await editTextInDb(db, id, newText);
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, text: newText } : t
        ));
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function setNotifTime(db: SQLite.SQLiteDatabase, id: number, notifDate: number, notifId: string) {
    try {
      await setNotifTimeInDb(db, id, notifDate, notifId);
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, notifDate, notifId } : t
        ));
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function deleteNotif(db: SQLite.SQLiteDatabase, taskId: number, notifId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notifId);
      await cancelNotifInDb(db, taskId);
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, notifDate: null, notifId: null } : t
        ));
      Alert.alert(`Cancelled notification: ${notifId}`);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function deleteExpiredTasks(db: SQLite.SQLiteDatabase) {
    try {
      const expDate = Date.now() - DAYS_TO_TASK_EXPIRATION * 24 * 60 * 60 * 1000;
      await deleteExpiredTasksFromDb(db, expDate);
    } catch (error) {
      Alert.alert(String(error));
    } finally {
      // console.log('deleteExpiredTasks()');
    }
  }

  async function clearData(db: SQLite.SQLiteDatabase) {
    try {
      await clearDB(db);
      await Notifications.cancelAllScheduledNotificationsAsync();
      setTasks([]);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  return (
    <TasksContext.Provider value={{
      tasks,
      addTask,
      setTasks,
      fetchAllTasks,
      deleteTask,
      deleteAllTasksForDay,
      toggleStatus,
      editText,
      setNotifTime,
      deleteNotif,
      deleteExpiredTasks,
      clearData,
      changePriority,
    }}>
      {children}
    </TasksContext.Provider>
  )
}

