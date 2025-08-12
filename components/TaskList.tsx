import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTask, setAddTask] = useState<boolean>(false);
  const [taskValue, setTaskValue] = useState<string>('');
  const newTaskRef = useRef(null);
  const db = useSQLiteContext();
  
  return (
    <ScrollView style={styles.container}>
      <SQLiteProvider databaseName="tasks.db">
        {tasks.length > 0
          ? tasks.map(t => (
            <TaskElement key={t.id} task={t} />
          ))
          : <Text>No tasks for today</Text>
        }

        {addTask && (
          <View style={styles.taskInputWrapper}>
            <TextInput
              style={styles.taskInput}
              ref={newTaskRef}
              onChangeText={setTaskValue}
              value={taskValue}
              placeholder="Enter new task..."
            />
            <TouchableOpacity
              style={styles.saveTaskBtn}
              onPress={onSubmit}
            >
              <Text>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelTaskBtn}
              onPress={onCancel}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.createBtn}
          onPress={onPress}
        >
          <Text style={styles.createBtnText}>+</Text>
        </TouchableOpacity>
      </SQLiteProvider>
    </ScrollView>
  )
}
