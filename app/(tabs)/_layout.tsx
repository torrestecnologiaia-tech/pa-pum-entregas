import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { BlurView } from "expo-blur";
import { Home, Package, PlusCircle, User } from "lucide-react-native";
import { HapticTab } from "@/components/haptic-tab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6c5a00",
        tabBarInactiveTintColor: "#adadad",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          height: 88,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : "rgba(255,255,255,0.95)",
          paddingBottom: Platform.OS === "ios" ? 24 : 10,
          paddingTop: 8,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={90}
              tint="light"
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.6)" }}
            />
          ) : null,
        tabBarLabelStyle: {
          fontFamily: "Inter_400Regular",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pedidos"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color }) => <Package size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="nova-entrega"
        options={{
          title: "Nova",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? "#ffd709" : "#2f2f2f",
                borderRadius: 16,
                padding: 6,
                marginBottom: 2,
              }}
            >
              <PlusCircle size={22} color={focused ? "#2f2f2f" : "#ffd709"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
      {/* Oculta a antiga explore da tab bar */}
      <Tabs.Screen
        name="explore"
        options={{ href: null }}
      />
    </Tabs>
  );
}
