import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalProps {
  notifModalVisible: boolean,
  setNotifModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function NotifModal({notifModalVisible, setNotifModalVisible}: ModalProps) {

  return (
    <Modal
      animationType="fade"
      visible={notifModalVisible}
      transparent={true}
      onRequestClose={() => setNotifModalVisible(!notifModalVisible)}
    >
      <View
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          {/* <TimePicker /> */}
          <TouchableOpacity style={styles.modalBtn}>
            <Text 
              style={styles.modalText} 
              onPress={() => setNotifModalVisible(!notifModalVisible)}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#222831',
    borderRadius: 10,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '70%',
    minHeight: '50%',
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
  },
  modalBtn: {
    backgroundColor: '#393E46',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  }
});
