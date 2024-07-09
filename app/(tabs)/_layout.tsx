import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import icons from "@/constants/icons"
type tabIconProps = {
  icon?: any, color: string, name?: string, focused: boolean
}

const TabIcon = ({ icon, color, name, focused }: tabIconProps) => {
  return (
    <View className='items-center justify-center gap-2'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className=' w-6 h-6'
      />
      <Text className={`${focused ? " font-psemibold" : "font-pregular"} text-xs`}>
        {name}
      </Text>
    </View>
  )
}
const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 1,
          borderTopColor: "#232533",
          height: 84,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={icons.home} name='Home' />
          )
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={icons.bookmark} name='Bookmarks' />
          )
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "Create",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={icons.plus} name='Create' />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon={icons.profile} name='Profile' />
          )
        }}
      />
    </Tabs>
  )
}

export default TabsLayout