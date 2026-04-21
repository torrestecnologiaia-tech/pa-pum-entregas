import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { Home, Package, User } from "lucide-react-native";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6c5a00", // primary
        tabBarInactiveTintColor: "#adadad", // outline
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: 85,
          backgroundColor: Platform.OS === "ios" ? "transparent" : "rgba(255, 255, 255, 0.9)",
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="light"
              style={{ flex: 1, backgroundColor: "rgba(255, 255, 255, 0.5)" }}
            />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => <Package size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
