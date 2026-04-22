import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Package, MapPin, Search, ArrowUpRight, History, TrendingUp } from "lucide-react-native";
import { useRouter } from "expo-router";
import { fetchPedidos, fetchEstatisticas, type Pedido } from "@/lib/supabase";

// ─── Status config ─────────────────────────────────────────────────────────────

function statusColor(status: string) {
  switch (status) {
    case "em_transcurso": return { bg: "bg-[#fff7cc]", text: "text-[#6c5a00]", label: "Em Rota" };
    case "entregue":      return { bg: "bg-[#d0f1e1]", text: "text-[#1d6d45]", label: "Entregue" };
    case "cancelado":     return { bg: "bg-[#fde8e8]", text: "text-[#c0392b]", label: "Cancelado" };
    default:              return { bg: "bg-[#e8e8e8]",  text: "text-[#666]",    label: "Aguardando" };
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return "Hoje, " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (diff < 172800000) return "Ontem, " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

// ─── OrderItem ────────────────────────────────────────────────────────────────

const OrderItem = React.memo(({ item, index }: { item: Pedido; index: number }) => {
  const cfg = statusColor(item.status);
  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: 400 + index * 100 }}
      className={`p-4 rounded-2xl mb-3 ${index % 2 === 0 ? "bg-surface-container-low" : "bg-white"}`}
      style={{ shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="font-jakarta text-on-surface text-base font-bold">{item.codigo}</Text>
          <Text className="font-inter text-on-surface/50 text-xs mt-0.5" numberOfLines={1}>
            {item.destino_endereco}
          </Text>
        </View>
        <View className="items-end">
          <View className={`${cfg.bg} px-2.5 py-1 rounded-lg`}>
            <Text className={`${cfg.text} font-inter text-[10px] font-bold uppercase`}>
              {cfg.label}
            </Text>
          </View>
          <Text className="font-jakarta text-on-surface font-bold text-sm mt-1">
            R$ {Number(item.valor).toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </View>
      <Text className="font-inter text-outline text-[10px] mt-1.5">{formatDate(item.criado_em)}</Text>
    </MotiView>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function DashboardScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [stats, setStats] = useState({ total: 0, receita: 0, emTransito: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const inTransito = pedidos.find((p) => p.status === "em_transcurso");

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const [data, s] = await Promise.all([fetchPedidos(), fetchEstatisticas()]);
      setPedidos(data.slice(0, 4));
      setStats(s);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#ffd709" />}
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="flex-row justify-between items-center mt-8 mb-6"
        >
          <View>
            <Text className="font-inter text-on-surface/50 text-sm">Bom dia,</Text>
            <Text className="font-jakarta text-on-surface text-3xl font-bold tracking-tight">
              Olá, Ricardo
            </Text>
          </View>
          <Image
            source="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: "#ffd709" }}
            contentFit="cover"
          />
        </MotiView>

        {/* Stats Row */}
        {loading ? (
          <ActivityIndicator color="#6c5a00" style={{ marginBottom: 24 }} />
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 80, type: "spring" }}
            className="flex-row gap-3 mb-6"
          >
            {[
              { label: "Total", value: stats.total.toString() },
              { label: "Em Rota", value: stats.emTransito.toString() },
              { label: "Receita", value: `R$\u00A0${stats.receita.toFixed(0)}` },
            ].map((s) => (
              <View key={s.label} className="flex-1 bg-white rounded-2xl p-3 items-center"
                style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
                <Text className="font-jakarta text-on-surface text-xl font-bold">{s.value}</Text>
                <Text className="font-inter text-outline text-[10px] mt-0.5">{s.label}</Text>
              </View>
            ))}
          </MotiView>
        )}

        {/* Tracking Card — só mostra se houver pedido em transito */}
        {inTransito && (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 120, type: "spring" }}
            className="bg-on-surface p-6 rounded-3xl mb-6"
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="bg-primary-fixed/20 p-2 rounded-lg">
                <Package size={20} color="#ffd709" />
              </View>
              <View className="items-end">
                <Text className="font-inter text-primary-fixed text-xs font-bold uppercase tracking-widest">
                  Em Tempo Real
                </Text>
                <Text className="font-jakarta text-white text-2xl font-bold">{inTransito.codigo}</Text>
              </View>
            </View>

            <View className="bg-white/10 h-1.5 w-full rounded-full overflow-hidden mb-4">
              <MotiView
                from={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ delay: 600, duration: 1500, type: "timing" }}
                className="bg-primary-fixed h-full"
              />
            </View>

            <Text className="font-inter text-white/60 text-xs" numberOfLines={1}>
              Destino: <Text className="text-white font-bold">{inTransito.destino_endereco}</Text>
            </Text>
          </MotiView>
        )}

        {/* Quick Actions */}
        <View className="flex-row gap-4 mb-6">
          <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 200 }}
            className="flex-1"
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(tabs)/nova-entrega")}
              className="bg-primary-fixed p-5 rounded-3xl h-48 justify-between"
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
            </TouchableOpacity>
          </MotiView>

          <View className="flex-1 gap-4">
            <MotiView from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 280 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(tabs)/pedidos")}
                className="bg-white p-5 rounded-3xl justify-between"
                style={{ height: 88, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
              >
                <Search size={20} color="#2f2f2f" />
                <Text className="font-jakarta text-on-surface text-sm font-bold">Ver Pedidos</Text>
              </TouchableOpacity>
            </MotiView>
            <MotiView from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 340 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-surface-container p-5 rounded-3xl justify-between"
                style={{ height: 88 }}
              >
                <TrendingUp size={20} color="#2f2f2f" />
                <Text className="font-jakarta text-on-surface text-sm font-bold">Relatório</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </View>

        {/* Recent Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <History size={18} color="#2f2f2f" />
            <Text className="font-jakarta text-on-surface text-lg font-bold">Pedidos Recentes</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/pedidos")} activeOpacity={0.7}>
            <Text className="font-inter text-primary font-bold text-xs">Ver todos</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View className="pb-28">
          {loading ? (
            <ActivityIndicator color="#6c5a00" style={{ marginTop: 16 }} />
          ) : pedidos.length === 0 ? (
            <View className="items-center py-10">
              <Package size={36} color="#adadad" />
              <Text className="font-jakarta text-on-surface/40 font-bold mt-3">Sem pedidos ainda</Text>
            </View>
          ) : (
            pedidos.map((item, index) => (
              <OrderItem key={item.id} item={item} index={index} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
