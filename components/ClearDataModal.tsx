import { allThemes } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import { useTasks } from '@/hooks/useTasks';
import { useTranslation } from '@/hooks/useTranslation';
import * as SQLite from 'expo-sqlite';
import React, { memo, useCallback } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import DialogBtn from './DialogBtn';

interface ClearDataModalProps {
  showClearDataModal: boolean,
  setShowClearDataModal: React.Dispatch<React.SetStateAction<boolean>>,
};

const ClearDataModal = memo(function ClearDataModal({showClearDataModal, setShowClearDataModal}: ClearDataModalProps) {
  const { fontSize, curTheme, clearPrefs } = useGeneral();
  const { clearData } = useTasks();
  const db = SQLite.useSQLiteContext();
  const i18n = useTranslation();

  const onConfirm = useCallback(async() => {
    setShowClearDataModal(false);
    try {
      clearPrefs();
      clearData(db);
      Alert.alert("App data has been deleted");
    } catch (error) {
      console.error(error);
    }
  }, [db, clearData, clearPrefs]);

  return (
    <Modal
      visible={showClearDataModal}
      onRequestClose={() => setShowClearDataModal(false)}
      style={styles.modal}
      backdropColor={'rgba(0, 0, 0, 0.5)'}
    >
      <View style={styles.centeredView}>
        <View style={[styles.dialogWrapper, { backgroundColor: allThemes[curTheme].mainBg }]}>
          <Text style={{ fontSize: 20 * fontSize,color: allThemes[curTheme].textColor }}>
            {i18n.t("settingsTab.clearDataDialog")}
          </Text>
          <View style={styles.btnWrapper}>
            <DialogBtn status="success" btnText={i18n.t("ok")} onPressFn={onConfirm} />
            <DialogBtn status="danger" btnText={i18n.t("cancel")} onPressFn={() => setShowClearDataModal(false)} />
          </View>
        </View>
      </View>
    </Modal>
  )
})

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
});

export default ClearDataModal;
