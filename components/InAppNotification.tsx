import React from 'react'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'

interface NotifProps {
  msg: string,
  status: "danger" | "success"
}

export default function InAppNotification({ msg, status }: NotifProps) {
  return (
    <Animated.View
      style={{ backgroundColor: status === "danger" ? "red" : "green"}}
    >
      <Text>{msg}</Text>
    </Animated.View>
  )
}
