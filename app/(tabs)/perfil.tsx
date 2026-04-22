import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import {
  User,
  Package,
  DollarSign,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react-native';
import { fetchEstatisticas, supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total: number;
  receita: number;
  emTransito: number;
  entregues: number;
}

// ─── MenuRow ──────────────────────────────────────────────────────────────────

const MenuRow = React.memo(({
  Icon,
  label,
  value,
  onPress,
  toggle,
  toggled,
  onToggle,
  danger,
  delay,
}: {
  Icon: React.FC<{ size: number; color: string }>;
  label: string;
  value?: string;
  onPress?: () => void;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  danger?: boolean;
  delay?: number;
}) => (
  <MotiView from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: delay ?? 0, type: 'timing', duration: 300 }}>
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={toggle ? 1 : 0.7}
      disabled={toggle}
      className="flex-row items-center py-4 px-4 border-b border-surface-container-low"
    >
      <View className={`p-2.5 rounded-xl mr-4 ${danger ? 'bg-[#fde8e8]' : 'bg-surface-container-low'}`}>
        <Icon size={18} color={danger ? '#c0392b' : '#2f2f2f'} />
      </View>
      <Text className={`flex-1 font-inter font-bold text-sm ${danger ? 'text-[#c0392b]' : 'text-on-surface'}`}>
        {label}
      </Text>
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: '#e0e0e0', true: '#ffd709' }}
          thumbColor="#fff"
        />
      ) : value ? (
        <Text className="font-inter text-outline text-xs mr-2">{value}</Text>
      ) : null}
      {!toggle && <ChevronRight size={16} color="#adadad" />}
    </TouchableOpacity>
  </MotiView>
));

// ─── Section ─────────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="font-inter text-outline text-xs font-bold uppercase tracking-widest px-4 mb-2">
        {title}
      </Text>
      <View
        className="bg-white rounded-3xl overflow-hidden"
        style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}
      >
        {children}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PerfilScreen() {
  const [stats, setStats] = useState<Stats>({ total: 0, receita: 0, emTransito: 0, entregues: 0 });
  const [notifs, setNotifs] = useState(true);

  useEffect(() => {
    fetchEstatisticas().then(setStats).catch(() => {});
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => supabase.auth.signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>

        {/* Header */}
        <MotiView from={{ opacity: 0, translateY: -16 }} animate={{ opacity: 1, translateY: 0 }} className="mt-8 mb-6">
          <Text className="font-inter text-on-surface/50 text-sm">Sua conta</Text>
          <Text className="font-jakarta text-on-surface text-3xl font-bold tracking-tight">Perfil</Text>
        </MotiView>

        {/* Avatar Card */}
        <MotiView
          from={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 80, type: 'spring' }}
          className="bg-on-surface rounded-3xl p-6 mb-6 flex-row items-center gap-4"
        >
          <View className="relative">
            <Image
              source="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop"
              style={{ width: 72, height: 72, borderRadius: 36 }}
              contentFit="cover"
            />
            <View className="absolute -bottom-1 -right-1 bg-primary-fixed w-6 h-6 rounded-full items-center justify-center border-2 border-on-surface">
              <Star size={10} color="#2f2f2f" />
            </View>
          </View>

          <View className="flex-1">
            <Text className="font-jakarta text-white text-xl font-bold">Ricardo Torres</Text>
            <Text className="font-inter text-white/50 text-sm">rico@papum.com.br</Text>
            <View className="flex-row items-center gap-1.5 mt-2">
              <Zap size={12} color="#ffd709" />
              <Text className="font-inter text-primary-fixed text-xs font-bold">Plano Pro · Ativo</Text>
            </View>
          </View>
        </MotiView>

        {/* Stats */}
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 160 }} className="flex-row gap-3 mb-6">
          {[
            { label: 'Entregas', value: stats.total.toString(), Icon: Package },
            { label: 'Receita', value: `R$\u00A0${stats.receita.toFixed(0)}`, Icon: DollarSign },
            { label: 'Em Rota', value: stats.emTransito.toString(), Icon: Zap },
          ].map((s, i) => (
            <MotiView
              key={s.label}
              from={{ opacity: 0, translateY: 16 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 200 + i * 60, type: 'timing' }}
              className="flex-1 bg-white rounded-2xl p-4 items-center"
              style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 }}
            >
              <s.Icon size={18} color="#6c5a00" />
              <Text className="font-jakarta text-on-surface text-xl font-bold mt-1">{s.value}</Text>
              <Text className="font-inter text-outline text-[10px] mt-0.5">{s.label}</Text>
            </MotiView>
          ))}
        </MotiView>

        {/* Menu: Conta */}
        <Section title="Conta">
          <MenuRow Icon={User} label="Dados Pessoais" value="Editar" delay={280} />
          <MenuRow Icon={Shield} label="Segurança e Senha" delay={320} />
          <MenuRow Icon={Package} label="Meu Plano" value="Pro" delay={360} />
        </Section>

        {/* Menu: Preferências */}
        <Section title="Preferências">
          <MenuRow Icon={Bell} label="Notificações" toggle toggled={notifs} onToggle={setNotifs} delay={420} />
        </Section>

        {/* Menu: Suporte */}
        <Section title="Suporte">
          <MenuRow Icon={HelpCircle} label="Central de Ajuda" delay={480} />
        </Section>

        {/* Logout */}
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 540 }}>
          <Section title="">
            <MenuRow Icon={LogOut} label="Sair da conta" onPress={handleLogout} danger delay={560} />
          </Section>
        </MotiView>

        <Text className="font-inter text-outline text-xs text-center mt-2">
          Pa Pum Entregas · v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
