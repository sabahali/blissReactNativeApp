import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from 'react-native';
import { NativeWindStyleSheet } from "nativewind";


export default function Index() {
  return (
    <View className="flex-1 justify-center items-center font-pblack">
      <Text>Auroa!</Text>
      <StatusBar style="dark" />
      <Link href="/profile" style={{ color: 'blue' }}>Go to Profile</Link>
    </View>
  );
}

NativeWindStyleSheet.setOutput({
  default: "native",
});