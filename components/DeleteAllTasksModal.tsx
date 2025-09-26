import { allThemes } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/hooks/useTranslation';
import * as SQLite from 'expo-sqlite';
import React from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface DeleteAllTasksModalProps {
  db: SQLite.SQLiteDatabase,
  showDeleteAllTasksModal: boolean,
  targetDate: Date,
  setShowDeleteAllTasksModal: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function DeleteAllTasksModal({db, showDeleteAllTasksModal, setShowDeleteAllTasksModal, targetDate}: DeleteAllTasksModalProps) {
  const { fontSize, curTheme } = useGeneral();
  const { deleteAllTasksForDay } = useTasks();
  const i18n = useTranslation();

  async function onConfirm() {
    setShowDeleteAllTasksModal(false);
    try {
      await deleteAllTasksForDay(db, targetDate);
      Alert.alert(i18n.t("deleteTasksSuccessMsg"));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Modal
      visible={showDeleteAllTasksModal}
      onRequestClose={() => setShowDeleteAllTasksModal(false)}
      style={styles.modal}
      backdropColor={'rgba(0, 0, 0, 0.5)'}
    >
      <View style={styles.centeredView}>
        <View style={[styles.dialogWrapper, { backgroundColor: allThemes[curTheme].mainBg }]}>
          <Text style={{ fontSize: 20 * fontSize,color: allThemes[curTheme].textColor }}>
            {i18n.t("deleteTasksForDayDialog")}
          </Text>
          <View style={styles.btnWrapper}>
            <Pressable
              style={[styles.confirmBtn, styles.btn]}
              onPress={onConfirm}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>{i18n.t("ok")}</Text>
            </Pressable>
            <Pressable
              style={[styles.cancelTaskBtn, styles.btn]}
              onPress={() => setShowDeleteAllTasksModal(false)}
            >
              <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>{i18n.t("cancel")}</Text>
            </Pressable>
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
  dialogWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 17,
    width: '85%',
    padding: 10,
    borderRadius: 10
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
    gap: 20,
    marginTop: 20,
  },
  btn: {
    padding: 6,
    borderRadius: 5,
    minWidth: 70,
  },
  confirmBtn: {
    backgroundColor: 'green',
  },
  cancelTaskBtn: {
    backgroundColor: 'red',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  }
})

