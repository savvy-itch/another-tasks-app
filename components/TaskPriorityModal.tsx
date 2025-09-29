import { ALL_PRIORITIES, allThemes, BASE_FONT_SIZE } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/hooks/useTranslation';
import { TaskPriorities } from '@/types';
import * as SQLite from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import DialogBtn from './DialogBtn';

interface TaskPriorityProps {
  taskId: number,
  curPriority: TaskPriorities,
  showTaskPriorityModal: boolean,
  setShowTaskPriorityModal: React.Dispatch<React.SetStateAction<boolean>>,
  db: SQLite.SQLiteDatabase,
};

const INDICATOR_SIZE = 17;

export default function TaskPriorityModal({ taskId, curPriority, showTaskPriorityModal, setShowTaskPriorityModal, db }: TaskPriorityProps) {
  const { fontSize, curTheme } = useGeneral();
  const { changePriority } = useTasks();
  const [selectedPriority, setSelectedPriority] = useState<TaskPriorities>(curPriority);
  const i18n = useTranslation();

  const onConfirm = useCallback(async () => {
    await changePriority(db, taskId, selectedPriority);
    setShowTaskPriorityModal(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePriority, db, taskId, selectedPriority]);

  return (
    <Modal
      visible={showTaskPriorityModal}
      onRequestClose={() => setShowTaskPriorityModal(false)}
      style={styles.modal}
      backdropColor={'rgba(0, 0, 0, 0.5)'}
    >
      <View style={styles.centeredView}>
        <View style={[styles.dialogWrapper, { backgroundColor: allThemes[curTheme].mainBg }]}>
          <Text style={{ fontSize: BASE_FONT_SIZE * fontSize, color: allThemes[curTheme].textColor }}>Choose task priority:</Text>

          {ALL_PRIORITIES.map(p =>
            <Pressable
              key={p}
              style={[styles.radio, { borderColor: allThemes[curTheme].textColor }]}
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
          )}

          <View style={styles.btnWrapper}>
            <DialogBtn status="success" btnText={i18n.t("ok")} onPressFn={onConfirm} />
            <DialogBtn status="danger" btnText={i18n.t("cancel")} onPressFn={() => setShowTaskPriorityModal(false)} />
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
  radio: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 12,
    width: '100%',
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
});
