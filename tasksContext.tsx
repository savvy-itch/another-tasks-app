import * as Notifications from 'expo-notifications';
import * as SQLite from 'expo-sqlite';
import React, { createContext, useState } from "react";
import { Alert } from 'react-native';
import { addTaskToDb, cancelNotifInDb, deleteExpiredTasksFromDb, deleteTaskFromDb, editTextInDb, fetchAllTasksFromDb, fetchTasksForDayFromDb, fetchTodaysTasksFromDb, setNotifTimeInDb, toggleStatusInDb } from "./db";
import { DAYS_TO_TASK_EXPIRATION } from './globals';
import { Bool, Task, TasksContextType } from "./types";

export const TasksContext = createContext<TasksContextType | null>(null);

interface TasksProviderProps {
  children: React.ReactNode;
}

export default function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function fetchAllTasks(db: SQLite.SQLiteDatabase) {
    try {
      setIsLoading(true);
      const res = await fetchAllTasksFromDb(db);
      setTasks(res);
    } catch (error) {
      Alert.alert(String(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function addTask(db: SQLite.SQLiteDatabase, newTask: Task) {
    try {
      await addTaskToDb(db, newTask);
      setTasks(prev => [...prev, newTask]);
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

  async function fetchTodaysTasks(db: SQLite.SQLiteDatabase) {
    try {
      const result = await fetchTodaysTasksFromDb(db);
      if (result) {
        setTasks(result);
      }
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  async function fetchTasksForDay(db: SQLite.SQLiteDatabase, targetDate: Date) {
    try {
      const result = await fetchTasksForDayFromDb(db, targetDate);
      if (result) {
        setTasks(result);
      }
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
      // Alert.alert(`Set notification: ${notifId}`);
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
      // const expDate = new Date(Date.now());
      // expDate.setHours(0);
      // expDate.setMinutes(0);
      // expDate.setSeconds(0);
      await deleteExpiredTasksFromDb(db, expDate);
      const updatedTasks = tasks.filter(t => t.assignedDate > expDate);
      setTasks(updatedTasks);
    } catch (error) {
      Alert.alert(String(error));
    }
  }

  return (
    <TasksContext.Provider value={{
      tasks,
      isLoading,
      setIsLoading,
      addTask,
      setTasks,
      fetchAllTasks,
      deleteTask,
      toggleStatus,
      fetchTodaysTasks,
      fetchTasksForDay,
      editText,
      setNotifTime,
      deleteNotif,
      deleteExpiredTasks,
    }}>
      {children}
    </TasksContext.Provider>
  )
}

