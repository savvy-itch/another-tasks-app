import CustomDatePicker from '@/components/CustomDatePicker';
import { MAIN_BG } from '@/globals';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Calendar() {
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <View style={styles.mainContainer}>
      <CustomDatePicker />

      <Pressable onPress={() => setShowModal(true)}>
        <Text>
          Show Modal
        </Text>
      </Pressable>

      <Modal
        animationType='slide'
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
        backdropColor={'gray'}
      >
        <Text>Here will be the list of tasks</Text>
        <Pressable onPress={() => setShowModal(false)}>
          <Text>
            Close Modal
          </Text>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: MAIN_BG,
  }
});
