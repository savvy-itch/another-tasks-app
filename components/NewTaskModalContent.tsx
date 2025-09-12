import { MAX_TASK_LENGTH } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { Bool, Task } from '@/types';
import * as SQLite from 'expo-sqlite';
import React, { useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskModalProps {
  db: SQLite.SQLiteDatabase,
  addTaskMode: boolean,
  assignedDate: number,
  setAddTaskMode: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function NewTaskModalContent({ db, addTaskMode, assignedDate, setAddTaskMode }: TaskModalProps) {
  const [taskValue, setTaskValue] = useState<string>('');
  const { addTask } = useTasks();
  const { fontSize } = useGeneral();
  const newTaskRef = useRef(null);

  async function onSubmit() {
    if (taskValue) {
      const date = Date.now();
      const newTask: Task = { id: date, text: taskValue, created: date, assignedDate, isDone: Bool.FALSE };
      addTask(db, newTask);
      setAddTaskMode(false);
      setTaskValue('');
      setAddTaskMode(false);
    }
  }

  function onCancel() {
    setAddTaskMode(false);
    setTaskValue('');
    setAddTaskMode(false);
  }

  return (
    <Modal
      visible={addTaskMode}
      onRequestClose={onCancel}
      style={styles.modal}
      backdropColor={'rgba(0, 0, 0, 0.5)'}
    >
      <View style={styles.centeredView}>
        <View style={styles.taskInputWrapper}>
          <TextInput
            style={[styles.taskInput, { fontSize: 22 * fontSize }]}
            ref={newTaskRef}
            onChangeText={setTaskValue}
            value={taskValue}
            maxLength={MAX_TASK_LENGTH}
            placeholder="Enter new task..."
          />
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={[styles.saveTaskBtn, styles.btn]}
              onPress={onSubmit}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelTaskBtn, styles.btn]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInputWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 17,
    width: '85%',
    flex: 1,
  },
  taskInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    padding: 6,
    borderRadius: 3,
    flexShrink: 1,
    width: '100%',
  },
  btnWrapper: {
    flexDirection: 'row',
    gap: 15
  },
  btn: {
    padding: 6,
    borderRadius: 5,
  },
  saveTaskBtn: {
    backgroundColor: 'green',
  },
  cancelTaskBtn: {
    backgroundColor: 'red',
  },
  btnText: {
    color: 'white',
  }
})
