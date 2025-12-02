'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LogOut,
  LayoutDashboard,
  List,
  BarChart3,
  QrCode,
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Ticket,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

type ReportData = {
  periodo: number;
  faturamento: {
    total: number;
    porDia: { [key: string]: number };
    crescimento: number;
    ticketMedio: number;
  };
  reservas: {
    total: number;
    pendentes: number;
    confirmadas: number;
    aprovadas: number;
    rejeitadas: number;
    canceladas: number;
    porDia: { [key: string]: number };
    crescimento: number;
    horariosMaisProcurados: [string, number][];
    totalPessoas: number;
    mediaPessoas: number;
  };
  vouchers: {
    total: number;
    utilizados: number;
    naoUtilizados: number;
    expirados: number;
    valorTotal: number;
    valorUtilizado: number;
    taxaUtilizacao: string;
  };
};

export default function AdminReports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30');
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin');
    }
  }, [router]);

  useEffect(() => {
    fetchReports();
  }, [periodo]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?periodo=${periodo}`);
      const result = await response.json();
      if (response.ok) {
        setData(result);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  // Calcular max value para o gráfico de barras
  const getMaxValue = (obj: { [key: string]: number }) => {
    const values = Object.values(obj);
    return values.length > 0 ? Math.max(...values) : 1;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/images/logo-rosa-mexicano.png" alt="Rosa Mexicano" width={120} height={40} className="h-10 w-auto" />
              <span className="text-sm text-zinc-400 border-l border-zinc-700 pl-4">Painel Administrativo</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
              <LogOut className="w-4 h-4" />Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-zinc-900 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition whitespace-nowrap">
              <LayoutDashboard className="w-4 h-4" />Dashboard
            </Link>
            <Link href="/admin/reservations" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition whitespace-nowrap">
              <List className="w-4 h-4" />Reservas
            </Link>
            <Link href="/admin/validar-voucher" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition whitespace-nowrap">
              <QrCode className="w-4 h-4" />Voucher
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#E53935] text-white whitespace-nowrap">
              <BarChart3 className="w-4 h-4" />Relatórios
            </Link>
            <Link href="/admin/usuarios" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-zinc-400 hover:text-white transition whitespace-nowrap">
              <Users className="w-4 h-4" />Usuários
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="60">Últimos 60 dias</option>
            <option value="90">Últimos 90 dias</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#E53935]" />
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Faturamento */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-900/30 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  {data.faturamento.crescimento !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${data.faturamento.crescimento > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.faturamento.crescimento > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(data.faturamento.crescimento)}%
                    </div>
                  )}
                </div>
                <p className="text-zinc-400 text-sm">Faturamento Total</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(data.faturamento.total)}</p>
                <p className="text-xs text-zinc-500 mt-1">Ticket médio: {formatCurrency(data.faturamento.ticketMedio)}</p>
              </div>

              {/* Reservas */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-900/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  {data.reservas.crescimento !== 0 && (
                    <div className={`flex items-center gap-1 text-sm ${data.reservas.crescimento > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.reservas.crescimento > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {Math.abs(data.reservas.crescimento)}%
                    </div>
                  )}
                </div>
                <p className="text-zinc-400 text-sm">Total de Reservas</p>
                <p className="text-2xl font-bold text-blue-400">{data.reservas.total}</p>
                <p className="text-xs text-zinc-500 mt-1">{data.reservas.totalPessoas} pessoas (média: {data.reservas.mediaPessoas})</p>
              </div>

              {/* Vouchers */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-900/30 rounded-lg">
                    <Ticket className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-sm text-purple-400">{data.vouchers.taxaUtilizacao}% usado</span>
                </div>
                <p className="text-zinc-400 text-sm">Vouchers Emitidos</p>
                <p className="text-2xl font-bold text-purple-400">{data.vouchers.total}</p>
                <p className="text-xs text-zinc-500 mt-1">{data.vouchers.utilizados} utilizados</p>
              </div>

              {/* Taxa de Conversão */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-900/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {data.reservas.total > 0
                    ? (((data.reservas.confirmadas + data.reservas.aprovadas) / data.reservas.total) * 100).toFixed(1)
                    : '0'}%
                </p>
                <p className="text-xs text-zinc-500 mt-1">{data.reservas.confirmadas + data.reservas.aprovadas} confirmadas/aprovadas</p>
              </div>
            </div>

            {/* Status das Reservas */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-6">Status das Reservas</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                  <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-400">{data.reservas.pendentes}</p>
                  <p className="text-sm text-zinc-400">Pendentes</p>
                </div>
                <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-400">{data.reservas.confirmadas}</p>
                  <p className="text-sm text-zinc-400">Confirmadas</p>
                </div>
                <div className="text-center p-4 bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-400">{data.reservas.aprovadas}</p>
                  <p className="text-sm text-zinc-400">Aprovadas</p>
                </div>
                <div className="text-center p-4 bg-red-900/20 rounded-lg">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-400">{data.reservas.rejeitadas}</p>
                  <p className="text-sm text-zinc-400">Rejeitadas</p>
                </div>
                <div className="text-center p-4 bg-zinc-800 rounded-lg">
                  <XCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-zinc-400">{data.reservas.canceladas}</p>
                  <p className="text-sm text-zinc-400">Canceladas</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Faturamento por Dia */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h2 className="text-xl font-semibold mb-6">Faturamento por Dia</h2>
                {Object.keys(data.faturamento.porDia).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(data.faturamento.porDia)
                      .sort((a, b) => a[0].localeCompare(b[0]))
                      .slice(-10)
                      .map(([date, value]) => (
                        <div key={date} className="flex items-center gap-3">
                          <span className="text-sm text-zinc-400 w-16">{formatDate(date)}</span>
                          <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                            <div
                              className="h-full bg-green-600 rounded"
                              style={{
                                width: `${(value / getMaxValue(data.faturamento.porDia)) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-24 text-right">{formatCurrency(value)}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-8">Nenhum dado no período</p>
                )}
              </div>

              {/* Horários Mais Procurados */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <h2 className="text-xl font-semibold mb-6">Horários Mais Procurados</h2>
                {data.reservas.horariosMaisProcurados.length > 0 ? (
                  <div className="space-y-3">
                    {data.reservas.horariosMaisProcurados.map(([horario, quantidade], index) => (
                      <div key={horario} className="flex items-center gap-3">
                        <div className="flex items-center gap-2 w-20">
                          <Clock className="w-4 h-4 text-zinc-500" />
                          <span className="text-sm font-medium">{horario}</span>
                        </div>
                        <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded"
                            style={{
                              width: `${(quantidade / data.reservas.horariosMaisProcurados[0][1]) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-zinc-400 w-20 text-right">{quantidade} reservas</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-8">Nenhum dado no período</p>
                )}
              </div>
            </div>

            {/* Vouchers */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-6">Vouchers</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-2">Distribuição</p>
                  <div className="flex h-4 rounded overflow-hidden bg-zinc-800">
                    {data.vouchers.total > 0 && (
                      <>
                        <div
                          className="bg-green-600"
                          style={{ width: `${(data.vouchers.utilizados / data.vouchers.total) * 100}%` }}
                          title={`Utilizados: ${data.vouchers.utilizados}`}
                        />
                        <div
                          className="bg-blue-600"
                          style={{ width: `${(data.vouchers.naoUtilizados / data.vouchers.total) * 100}%` }}
                          title={`Não utilizados: ${data.vouchers.naoUtilizados}`}
                        />
                        <div
                          className="bg-red-600"
                          style={{ width: `${(data.vouchers.expirados / data.vouchers.total) * 100}%` }}
                          title={`Expirados: ${data.vouchers.expirados}`}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded" /> Utilizados ({data.vouchers.utilizados})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-600 rounded" /> Pendentes ({data.vouchers.naoUtilizados})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-600 rounded" /> Expirados ({data.vouchers.expirados})
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-zinc-400 mb-2">Valor Total Emitido</p>
                  <p className="text-2xl font-bold text-purple-400">{formatCurrency(data.vouchers.valorTotal)}</p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-zinc-400 mb-2">Valor Utilizado</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(data.vouchers.valorUtilizado)}</p>
                </div>
              </div>
            </div>

            {/* Reservas por Dia */}
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
              <h2 className="text-xl font-semibold mb-6">Reservas por Dia</h2>
              {Object.keys(data.reservas.porDia).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(data.reservas.porDia)
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .slice(-14)
                    .map(([date, value]) => (
                      <div key={date} className="flex items-center gap-3">
                        <span className="text-sm text-zinc-400 w-16">{formatDate(date)}</span>
                        <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded"
                            style={{
                              width: `${(value / getMaxValue(data.reservas.porDia)) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-20 text-right">{value} reservas</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-center py-8">Nenhum dado no período</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-20">Erro ao carregar relatórios</p>
        )}
      </main>
    </div>
  );
}
