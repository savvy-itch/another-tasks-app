import { ALL_PRIORITIES, allThemes, BASE_FONT_SIZE, INDICATOR_SIZE, MAX_TASK_LENGTH } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/hooks/useTranslation';
import { Bool, Task, TaskPriorities } from '@/types';
import * as SQLite from 'expo-sqlite';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface TaskModalProps {
  db: SQLite.SQLiteDatabase,
  addTaskMode: boolean,
  assignedDate: number,
  setAddTaskMode: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function NewTaskModalContent({ db, addTaskMode, assignedDate, setAddTaskMode }: TaskModalProps) {
  const [taskValue, setTaskValue] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriorities>("General");
  const { addTask } = useTasks();
  const { fontSize, curTheme } = useGeneral();
  const newTaskRef = useRef(null);
  const i18n = useTranslation();

  async function onSubmit() {
    if (taskValue) {
      const date = Date.now();
      const newTask: Omit<Task, "id"> = { text: taskValue, created: date, assignedDate, isDone: Bool.FALSE, priority: selectedPriority };
      addTask(db, newTask);
      setAddTaskMode(false);
      setTaskValue('');
    }
  }

  function onCancel() {
    setAddTaskMode(false);
    setTaskValue('');
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
            placeholder={i18n.t("newTaskPlaceholder")}
            autoFocus
          />

          <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor, textAlign: 'left', width: '100%', marginTop: 10 }}>{i18n.t("priority")}:</Text>
          <View style={styles.radioContainer}>
            {ALL_PRIORITIES.map(p => (
              <Pressable
                key={p}
                style={styles.radio}
                onPress={() => setSelectedPriority(p)}
              >
                <View style={[styles.radioIndicator, { borderColor: allThemes[curTheme].textColor }]}>
                  {/* wrapper is needed to guarantee border radius when radio is toggled */}
                  <View style={{ borderRadius: (INDICATOR_SIZE * 0.4) / 2, overflow: 'hidden' }}>
                    <View style={[styles.indicatorCore, p === selectedPriority && { backgroundColor: allThemes[curTheme].textColor }]} />
                  </View>
                </View>
                <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>{i18n.t(`priorities.${p}`)}</Text>
              </Pressable>

            ))}
          </View>

          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={[styles.saveTaskBtn, styles.btn]}
              onPress={onSubmit}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>{i18n.t("save")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelTaskBtn, styles.btn]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>{i18n.t("cancel")}</Text>
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
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  radio: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    padding: 4,
  },
  radioIndicator: {
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderWidth: 2,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorCore: {
    width: INDICATOR_SIZE * 0.4,
    height: INDICATOR_SIZE * 0.4,
    borderRadius: (INDICATOR_SIZE * 0.4) / 2,
  }
})
