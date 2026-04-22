import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkqzgdejrelmrfppybjo.supabase.co';
const supabaseAnonKey = 'sb_publishable_jRjEDrdCaLaESm4HmLKeJw_kwDNkKCM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type StatusPedido = 'aguardando' | 'em_transcurso' | 'entregue' | 'cancelado';

export interface Pedido {
  id: string;
  user_id?: string;
  codigo: string;
  status: StatusPedido;
  origem_endereco: string;
  destino_endereco: string;
  destinatario_nome: string;
  destinatario_telefone?: string;
  entregador_id?: string;
  valor: number;
  distancia_km?: number;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Perfil {
  id: string;
  user_id?: string;
  nome: string;
  telefone?: string;
  empresa?: string;
  avatar_url?: string;
  plano: string;
  total_entregas: number;
  created_at: string;
}

export interface NovoPedido {
  origem_endereco: string;
  destino_endereco: string;
  destinatario_nome: string;
  destinatario_telefone?: string;
  valor: number;
  observacoes?: string;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

function gerarCodigo(): string {
  return '#' + Math.floor(1000 + Math.random() * 9000).toString();
}

export async function fetchPedidos(): Promise<Pedido[]> {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function criarPedido(pedido: NovoPedido): Promise<Pedido> {
  const { data, error } = await supabase
    .from('pedidos')
    .insert([{ ...pedido, codigo: gerarCodigo(), status: 'aguardando' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchEstatisticas() {
  const { data } = await supabase.from('pedidos').select('status, valor');
  const total = data?.length ?? 0;
  const receita = data?.reduce((s, p) => s + Number(p.valor), 0) ?? 0;
  const emTransito = data?.filter((p) => p.status === 'em_transcurso').length ?? 0;
  const entregues = data?.filter((p) => p.status === 'entregue').length ?? 0;
  return { total, receita, emTransito, entregues };
}
