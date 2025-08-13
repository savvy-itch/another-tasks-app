import { TasksContext } from "@/tasksContext";
import { useContext } from "react";

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be within TasksProvider");
  }
  return context;
}