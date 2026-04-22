import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MotiView } from 'moti';
import {
  MapPin,
  User,
  Phone,
  DollarSign,
  FileText,
  ArrowRight,
  Home,
  CheckCircle,
} from 'lucide-react-native';
import { criarPedido, type NovoPedido } from '@/lib/supabase';

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  Icon: React.FC<{ size: number; color: string }>;
  keyboardType?: 'default' | 'phone-pad' | 'decimal-pad';
  multiline?: boolean;
}

const Field = React.memo(
  ({ label, placeholder, value, onChangeText, Icon, keyboardType = 'default', multiline }: FieldProps) => {
    const [focused, setFocused] = useState(false);
    return (
      <View className="mb-4">
        <Text className="font-inter text-on-surface/60 text-xs font-bold uppercase tracking-widest mb-2">
          {label}
        </Text>
        <View
          className={`flex-row items-center bg-white rounded-2xl px-4 ${multiline ? 'py-4 items-start' : 'h-14'}`}
          style={{
            shadowColor: '#000',
            shadowOpacity: focused ? 0.1 : 0.05,
            shadowRadius: focused ? 10 : 4,
            elevation: focused ? 4 : 1,
            borderWidth: 1.5,
            borderColor: focused ? '#ffd709' : 'transparent',
          }}
        >
          <View className={`mr-3 ${multiline ? 'mt-0.5' : ''}`}>
            <Icon size={18} color={focused ? '#6c5a00' : '#adadad'} />
          </View>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#c0c0c0"
            keyboardType={keyboardType}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1 font-inter text-on-surface text-sm"
            style={{ textAlignVertical: multiline ? 'top' : 'center', minHeight: multiline ? 72 : undefined }}
          />
        </View>
      </View>
    );
  }
);

// ─── Success View ─────────────────────────────────────────────────────────────

function SuccessView({ onNovo }: { onNovo: () => void }) {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 18 }}
      className="flex-1 items-center justify-center px-8"
    >
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 100, type: 'spring', damping: 14 }}
        className="bg-[#d0f1e1] p-8 rounded-full mb-6"
      >
        <CheckCircle size={64} color="#1d6d45" />
      </MotiView>
      <Text className="font-jakarta text-on-surface text-2xl font-bold text-center">Pedido Criado!</Text>
      <Text className="font-inter text-outline text-sm text-center mt-2 leading-5">
        Seu pedido foi registrado com sucesso.{'\n'}Um entregador será alocado em breve.
      </Text>
      <TouchableOpacity
        onPress={onNovo}
        activeOpacity={0.8}
        className="bg-primary-fixed mt-8 px-8 py-4 rounded-2xl"
      >
        <Text className="font-jakarta text-on-surface font-bold">Criar Outro Pedido</Text>
      </TouchableOpacity>
    </MotiView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

const INITIAL: NovoPedido = {
  origem_endereco: '',
  destino_endereco: '',
  destinatario_nome: '',
  destinatario_telefone: '',
  valor: 0,
  observacoes: '',
};

export default function NovaEntregaScreen() {
  const [form, setForm] = useState<NovoPedido>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = useCallback((key: keyof NovoPedido) => (val: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'valor' ? parseFloat(val) || 0 : val }));
  }, []);

  const isValid =
    form.origem_endereco.trim().length > 3 &&
    form.destino_endereco.trim().length > 3 &&
    form.destinatario_nome.trim().length > 1 &&
    form.valor > 0;

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert('Campos inválidos', 'Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      setLoading(true);
      await criarPedido(form);
      setDone(true);
    } catch {
      Alert.alert('Erro', 'Não foi possível criar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovo = () => {
    setForm(INITIAL);
    setDone(false);
  };

  if (done) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <SuccessView onNovo={handleNovo} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -16 }}
            animate={{ opacity: 1, translateY: 0 }}
            className="mt-8 mb-6"
          >
            <Text className="font-inter text-on-surface/50 text-sm">Solicitar</Text>
            <Text className="font-jakarta text-on-surface text-3xl font-bold tracking-tight">
              Nova Entrega
            </Text>
          </MotiView>

          {/* Section: Endereços */}
          <MotiView from={{ opacity: 0, translateX: -16 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 100 }}>
            <View className="flex-row items-center gap-2 mb-4">
              <View className="bg-primary-fixed w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-[10px] font-bold text-on-surface">1</Text>
              </View>
              <Text className="font-jakarta text-on-surface font-bold">Endereços</Text>
            </View>

            <Field label="Coleta (origem)" placeholder="R. das Flores, 120 - Centro" value={form.origem_endereco} onChangeText={set('origem_endereco')} Icon={Home} />
            <Field label="Entrega (destino)" placeholder="Av. Paulista, 1578 - Bela Vista" value={form.destino_endereco} onChangeText={set('destino_endereco')} Icon={MapPin} />
          </MotiView>

          {/* Section: Destinatário */}
          <MotiView from={{ opacity: 0, translateX: -16 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 200 }}>
            <View className="flex-row items-center gap-2 mb-4 mt-2">
              <View className="bg-primary-fixed w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-[10px] font-bold text-on-surface">2</Text>
              </View>
              <Text className="font-jakarta text-on-surface font-bold">Destinatário</Text>
            </View>

            <Field label="Nome *" placeholder="João da Silva" value={form.destinatario_nome} onChangeText={set('destinatario_nome')} Icon={User} />
            <Field label="Telefone" placeholder="(11) 98765-4321" value={form.destinatario_telefone ?? ''} onChangeText={set('destinatario_telefone')} Icon={Phone} keyboardType="phone-pad" />
          </MotiView>

          {/* Section: Valor */}
          <MotiView from={{ opacity: 0, translateX: -16 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 }}>
            <View className="flex-row items-center gap-2 mb-4 mt-2">
              <View className="bg-primary-fixed w-5 h-5 rounded-full items-center justify-center">
                <Text className="text-[10px] font-bold text-on-surface">3</Text>
              </View>
              <Text className="font-jakarta text-on-surface font-bold">Detalhes</Text>
            </View>

            <Field label="Valor (R$) *" placeholder="18.90" value={form.valor > 0 ? form.valor.toString() : ''} onChangeText={set('valor')} Icon={DollarSign} keyboardType="decimal-pad" />
            <Field label="Observações" placeholder="Cuidado, frágil. Chamar pelo interfone." value={form.observacoes ?? ''} onChangeText={set('observacoes')} Icon={FileText} multiline />
          </MotiView>

          {/* Submit button */}
          <MotiView from={{ opacity: 0, translateY: 16 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 400 }} className="mb-24">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading || !isValid}
              activeOpacity={0.8}
              className={`flex-row items-center justify-center gap-3 py-5 rounded-3xl mt-2 ${isValid ? 'bg-on-surface' : 'bg-outline/40'}`}
            >
              {loading ? (
                <ActivityIndicator color="#ffd709" />
              ) : (
                <>
                  <Text className={`font-jakarta font-bold text-base ${isValid ? 'text-primary-fixed' : 'text-white/40'}`}>
                    Confirmar Pedido
                  </Text>
                  <ArrowRight size={18} color={isValid ? '#ffd709' : '#ffffff40'} />
                </>
              )}
            </TouchableOpacity>

            {!isValid && (
              <Text className="font-inter text-outline text-xs text-center mt-3">
                * Preencha origem, destino, destinatário e valor
              </Text>
            )}
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
