
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LogOut,
  LayoutDashboard,
  List,
  BarChart3,
  QrCode,
  Table as TableIcon
} from 'lucide-react';
// Image removido - usar img tag
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '@/components/Skeleton';

type Stats = {
  totalReservations: number;
  confirmedReservations: number;
  pendingReservations: number;
  cancelledReservations: number;
  totalRevenue: number;
  totalPeople: number;
  todayReservations: number;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }

    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header skeleton */}
        <header className="bg-zinc-900 border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-28 bg-zinc-800 rounded animate-pulse" />
                <span className="text-sm text-zinc-600 border-l border-zinc-700 pl-4">
                  Carregando...
                </span>
              </div>
            </div>
          </div>
        </header>
        <nav className="bg-zinc-900 border-b border-zinc-800 h-12" />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0f0f0f] to-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo-rosa-mexicano.png"
                alt="Rosa Mexicano"
                className="h-12 w-auto drop-shadow-lg"
              />
              <div className="border-l border-white/20 pl-4">
                <h1 className="text-lg font-bold text-white">Rosa Mexicano</h1>
                <span className="text-xs text-[#FFD700]">Painel Administrativo</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C2185B] to-[#E53935] text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-[#C2185B]/50 transition"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed top-20 left-0 right-0 z-30 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#FFD700] text-white font-medium whitespace-nowrap">
              <LayoutDashboard className="w-4 h-4" />Dashboard
            </Link>
            <Link to="/admin/reservations" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white transition whitespace-nowrap">
              <List className="w-4 h-4" />Reservas
            </Link>
            <Link to="/admin/validar-voucher" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white transition whitespace-nowrap">
              <QrCode className="w-4 h-4" />Voucher
            </Link>
            <Link to="/admin/reports" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white transition whitespace-nowrap">
              <BarChart3 className="w-4 h-4" />Relatórios
            </Link>
            <Link to="/admin/usuarios" className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-white/60 hover:text-white transition whitespace-nowrap">
              <Users className="w-4 h-4" />Usuários
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 pt-40 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Dashboard</h1>
          <p className="text-white/60">Acompanhe as métricas e estatísticas em tempo real</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Reservas */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#C2185B]/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#C2185B]/20 rounded-lg">
                <Calendar className="w-6 h-6 text-[#FFD700]" />
              </div>
              <span className="text-3xl font-bold text-[#FFD700]">{stats?.totalReservations || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Total de Reservas</h3>
          </div>

          {/* Confirmadas */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-3xl font-bold text-green-400">{stats?.confirmedReservations || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Confirmadas</h3>
          </div>

          {/* Pendentes */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-3xl font-bold text-yellow-400">{stats?.pendingReservations || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Pendentes</h3>
          </div>

          {/* Receita Total */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#BA68C8]/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#BA68C8]/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#BA68C8]" />
              </div>
              <span className="text-2xl font-bold text-[#BA68C8]">
                R$ {((stats?.totalRevenue || 0) / 100).toFixed(2)}
              </span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Receita Total</h3>
          </div>

          {/* Total de Pessoas */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD700]/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#FFD700]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#FFD700]" />
              </div>
              <span className="text-3xl font-bold text-[#FFD700]">{stats?.totalPeople || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Total de Pessoas</h3>
          </div>

          {/* Hoje */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-orange-400">{stats?.todayReservations || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Reservas Hoje</h3>
          </div>

          {/* Canceladas */}
          <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-white/50 transition-all group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-3xl font-bold text-red-400">{stats?.cancelledReservations || 0}</span>
            </div>
            <h3 className="text-white/70 text-sm font-medium">Canceladas</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Link
            to="/admin/reservations"
            className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-[#C2185B] transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C2185B]/10 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <List className="w-8 h-8 text-[#FFD700] mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Ver Todas as Reservas</h3>
            <p className="text-sm text-white/60">
              Gerencie e visualize todas as reservas do sistema
            </p>
            <div className="mt-4 flex items-center text-[#FFD700] text-sm font-medium">
              Acessar →
            </div>
          </Link>

          <Link
            to="/admin/tables"
            className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-[#BA68C8] transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#BA68C8]/10 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <TableIcon className="w-8 h-8 text-[#BA68C8] mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Mapa de Mesas</h3>
            <p className="text-sm text-white/60">
              Visualize a ocupação das mesas por horário
            </p>
            <div className="mt-4 flex items-center text-[#BA68C8] text-sm font-medium">
              Acessar →
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="group relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:border-orange-400 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10 group-hover:blur-2xl transition" />
            <BarChart3 className="w-8 h-8 text-orange-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-white">Relatórios</h3>
            <p className="text-sm text-white/60">
              Analise estatísticas e gere relatórios
            </p>
            <div className="mt-4 flex items-center text-orange-400 text-sm font-medium">
              Acessar →
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
