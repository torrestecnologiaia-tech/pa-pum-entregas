import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { MotiView } from 'moti';
import {
  Package,
  PackageCheck,
  PackageX,
  Clock,
  ChevronRight,
  Filter,
} from 'lucide-react-native';
import { fetchPedidos, type Pedido, type StatusPedido } from '@/lib/supabase';

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS: { label: string; value: StatusPedido | 'todos' }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Em Rota', value: 'em_transcurso' },
  { label: 'Entregues', value: 'entregue' },
  { label: 'Aguardando', value: 'aguardando' },
  { label: 'Cancelados', value: 'cancelado' },
];

// ─── Status config ────────────────────────────────────────────────────────────

function statusConfig(status: StatusPedido) {
  switch (status) {
    case 'em_transcurso':
      return { label: 'Em Rota', bg: 'bg-[#fff7cc]', text: 'text-[#6c5a00]', Icon: Package };
    case 'entregue':
      return { label: 'Entregue', bg: 'bg-[#d0f1e1]', text: 'text-[#1d6d45]', Icon: PackageCheck };
    case 'cancelado':
      return { label: 'Cancelado', bg: 'bg-[#fde8e8]', text: 'text-[#c0392b]', Icon: PackageX };
    default:
      return { label: 'Aguardando', bg: 'bg-[#e8e8e8]', text: 'text-[#666]', Icon: Clock };
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return 'Hoje, ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (diff < 172800000) return 'Ontem, ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// ─── PedidoCard ───────────────────────────────────────────────────────────────

const PedidoCard = React.memo(({ item, index }: { item: Pedido; index: number }) => {
  const cfg = statusConfig(item.status);
  const Icon = cfg.Icon;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 60, type: 'timing', duration: 300 }}
    >
      <TouchableOpacity
        activeOpacity={0.75}
        className="bg-white rounded-2xl p-4 mb-3 flex-row items-center gap-3"
        style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
      >
        {/* Icon Badge */}
        <View className={`${cfg.bg} p-3 rounded-xl`}>
          <Icon size={20} color={item.status === 'em_transcurso' ? '#6c5a00' : item.status === 'entregue' ? '#1d6d45' : item.status === 'cancelado' ? '#c0392b' : '#666'} />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <Text className="font-jakarta text-on-surface text-base font-bold">{item.codigo}</Text>
            <Text className="font-jakarta text-on-surface font-bold text-sm">R$ {Number(item.valor).toFixed(2).replace('.', ',')}</Text>
          </View>
          <Text className="font-inter text-on-surface/60 text-xs mt-0.5" numberOfLines={1}>
            {item.destino_endereco}
          </Text>
          <View className="flex-row justify-between items-center mt-2">
            <View className={`${cfg.bg} px-2 py-0.5 rounded-md self-start`}>
              <Text className={`${cfg.text} font-inter text-[10px] font-bold uppercase`}>{cfg.label}</Text>
            </View>
            <Text className="font-inter text-outline text-[10px]">{formatDate(item.criado_em)}</Text>
          </View>
        </View>

        <ChevronRight size={16} color="#adadad" />
      </TouchableOpacity>
    </MotiView>
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<StatusPedido | 'todos'>('todos');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data = await fetchPedidos();
      setPedidos(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = filtro === 'todos' ? pedidos : pedidos.filter((p) => p.status === filtro);

  const renderItem = useCallback(
    ({ item, index }: { item: Pedido; index: number }) => (
      <PedidoCard item={item} index={index} />
    ),
    []
  );
  const keyExtractor = useCallback((item: Pedido) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <View>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -16 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mt-8 mb-6"
        >
          <Text className="font-inter text-on-surface/50 text-sm">Suas entregas</Text>
          <Text className="font-jakarta text-on-surface text-3xl font-bold tracking-tight">Pedidos</Text>
        </MotiView>

        {/* Summary row */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100, type: 'spring' }}
          className="flex-row gap-3 mb-6"
        >
          {[
            { label: 'Total', value: pedidos.length.toString(), color: '#2f2f2f' },
            { label: 'Em Rota', value: pedidos.filter((p) => p.status === 'em_transcurso').length.toString(), color: '#6c5a00' },
            { label: 'Entregues', value: pedidos.filter((p) => p.status === 'entregue').length.toString(), color: '#1d6d45' },
          ].map((s) => (
            <View key={s.label} className="flex-1 bg-white rounded-2xl p-4 items-center"
              style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}>
              <Text style={{ color: s.color }} className="font-jakarta text-2xl font-bold">{s.value}</Text>
              <Text className="font-inter text-outline text-xs mt-1">{s.label}</Text>
            </View>
          ))}
        </MotiView>

        {/* Filter tabs */}
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 200 }} className="mb-4">
          <FlatList
            data={FILTERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(i) => i.value}
            renderItem={({ item: f }) => (
              <TouchableOpacity
                onPress={() => setFiltro(f.value)}
                activeOpacity={0.75}
                className={`mr-2 px-4 py-2 rounded-full ${filtro === f.value ? 'bg-on-surface' : 'bg-white'}`}
                style={filtro !== f.value ? { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 } : {}}
              >
                <Text className={`font-inter font-bold text-xs ${filtro === f.value ? 'text-white' : 'text-outline'}`}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </MotiView>
      </View>
    ),
    [pedidos, filtro]
  );

  const ListEmpty = useCallback(
    () => (
      <View className="items-center py-16">
        <Filter size={40} color="#adadad" />
        <Text className="font-jakarta text-on-surface/40 text-lg font-bold mt-4">Nenhum pedido</Text>
        <Text className="font-inter text-outline text-sm mt-1">Tente outro filtro</Text>
      </View>
    ),
    []
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#6c5a00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#ffd709" />
        }
      />
    </SafeAreaView>
  );
}
