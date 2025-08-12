interface Task {
  id: number,
  text: string,
  created: number, // which day task is associated with
  assignedDate: number,
  notifDate?: number,
  isDone: boolean
};

export {
  Task
};

