import * as SQLite from 'expo-sqlite';
import React, { createContext, useState } from "react";
import { Alert } from 'react-native';
import { addTaskToDb, deleteTaskFromDb, editTextInDb, fetchTodaysTasksFromDb, toggleStatusInDb } from "./db";
import { Bool, Task, TasksContextType } from "./types";

export const TasksContext = createContext<TasksContextType | null>(null);

interface TasksProviderProps {
  children: React.ReactNode;
}

export default function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

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
          t.id === id ? { ...t, isDone: t.isDone ? Bool.FALSE : Bool.TRUE } : t
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

  return (
    <TasksContext.Provider value={{ 
      tasks, 
      addTask, 
      setTasks, 
      deleteTask, 
      toggleStatus, 
      fetchTodaysTasks,
      editText,
    }}>
      {children}
    </TasksContext.Provider>
  )
}

