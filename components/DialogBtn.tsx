import { DANGER_COLOR, SUCCESS_COLOR } from '@/globals';
import { useGeneral } from '@/hooks/useGeneral';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

/*
add active state styles
*/

interface DialogBtnProps {
  status: "success" | "danger",
  onPressFn: () => void,
  btnText: string,
}

const DialogBtn = memo(function DialogBtn({ status, onPressFn, btnText }: DialogBtnProps) {
  const { fontSize } = useGeneral();

  return (
    <Pressable
      style={({pressed}) => [
        styles.btn, 
        { backgroundColor: status === "success" ? SUCCESS_COLOR : DANGER_COLOR },
        pressed && { opacity: 0.8 }
      ]}
      onPress={onPressFn}
    >
      <Text style={[styles.btnText, { fontSize: 20 * fontSize }]}>{btnText}</Text>
    </Pressable>
  )
})

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    borderRadius: 5,
    minWidth: 70,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
  }
});

export default DialogBtn;
