import React, { useCallback } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Package, MapPin, Search, ArrowUpRight, History } from "lucide-react-native";

const ORDERS = [
  { id: "1", code: "#4582", status: "Em transcurso", date: "Hoje, 10:45", value: "R$ 18,90" },
  { id: "2", code: "#4579", status: "Entregue", date: "Ontem, 14:20", value: "R$ 24,50" },
  { id: "3", code: "#4575", status: "Entregue", date: "19 Abr, 11:15", value: "R$ 12,00" },
];

const OrderItem = React.memo(({ item, index }: { item: typeof ORDERS[0]; index: number }) => (
  <MotiView
    from={{ opacity: 0, translateX: -20 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ delay: 400 + index * 100 }}
    className={`p-4 rounded-xl mb-4 ${index % 2 === 0 ? "bg-surface-container-low" : "bg-surface"}`}
  >
    <View className="flex-row justify-between items-center">
      <View>
        <Text className="font-jakarta text-on-surface text-lg font-bold">{item.code}</Text>
        <Text className="font-inter text-on-surface/60 text-xs">{item.date}</Text>
      </View>
      <View className="items-end">
        <View className="bg-tertiary-container px-2 py-1 rounded-md">
          <Text className="font-inter text-tertiary text-[10px] font-bold uppercase">
            {item.status}
          </Text>
        </View>
        <Text className="font-jakarta text-on-surface font-bold mt-1">{item.value}</Text>
      </View>
    </View>
  </MotiView>
));

export default function DashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="flex-row justify-between items-center mt-8 mb-8"
        >
          <View>
            <Text className="font-inter text-on-surface/60 text-sm">Bom dia,</Text>
            <Text className="font-jakarta text-on-surface text-3xl font-bold tracking-tight">
              Olá, Ricardo
            </Text>
          </View>
          <Image
            source="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#ffd709" }}
          />
        </MotiView>

        {/* Tracking Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100, type: "spring" }}
          className="bg-on-surface p-6 rounded-3xl mb-8"
        >
          <View className="flex-row justify-between items-start mb-4">
            <View className="bg-primary-fixed/20 p-2 rounded-lg">
              <Package size={20} color="#ffd709" />
            </View>
            <View className="items-end">
              <Text className="font-inter text-primary-fixed text-xs font-bold uppercase tracking-widest">
                Em Tempo Real
              </Text>
              <Text className="font-jakarta text-white text-2xl font-bold">4 min</Text>
            </View>
          </View>
          
          <View className="bg-surface/10 h-1.5 w-full rounded-full overflow-hidden mb-4">
            <MotiView
              from={{ width: "0%" }}
              animate={{ width: "75%" }}
              transition={{ delay: 500, duration: 1500, type: "timing" }}
              className="bg-primary-fixed h-full"
            />
          </View>

          <Text className="font-inter text-white/60 text-xs">
            Seu entregador, <Text className="text-white font-bold">Bruno</Text>, está a 800m de você.
          </Text>
        </MotiView>

        {/* Quick Actions Grid */}
        <View className="flex-row gap-4 mb-8">
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200 }}
            className="flex-1 bg-primary-fixed p-5 rounded-3xl h-48 justify-between"
          >
            <ArrowUpRight size={24} color="#2f2f2f" />
            <View>
              <Text className="font-jakarta text-on-surface text-xl font-bold leading-tight">
                Nova{"\n"}Entrega
              </Text>
              <Text className="font-inter text-on-surface/60 text-[10px] mt-1">
                Solicite em 30s
              </Text>
            </View>
          </MotiView>

          <View className="flex-1 gap-4">
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 300 }}
              className="bg-white p-5 rounded-3xl flex-1 justify-between"
            >
              <Search size={20} color="#2f2f2f" />
              <Text className="font-jakarta text-on-surface text-sm font-bold">
                Simular Valor
              </Text>
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateX: 20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 400 }}
              className="bg-surface-container p-5 rounded-3xl flex-1 justify-between"
            >
              <MapPin size={20} color="#2f2f2f" />
              <Text className="font-jakarta text-on-surface text-sm font-bold">
                Meus Locais
              </Text>
            </MotiView>
          </View>
        </View>

        {/* Recent History Header */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center gap-2">
            <History size={18} color="#2f2f2f" />
            <Text className="font-jakarta text-on-surface text-lg font-bold">Pedidos Recentes</Text>
          </View>
          <Text className="font-inter text-primary font-bold text-xs">Ver todos</Text>
        </View>

        {/* History List */}
        <View className="pb-24">
          {ORDERS.map((item, index) => (
            <OrderItem key={item.id} item={item} index={index} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
